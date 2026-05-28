"""
API Flask para predicciones del modelo CatBoost - Saber 11
=========================================================
Ejecutar:  python api_catboost.py
Probar:    curl -X POST http://127.0.0.1:5000/predict -H "Content-Type: application/json" -d "{...}"
"""

import os, joblib, numpy as np, pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from catboost import CatBoostRegressor

# ── Rutas de los archivos guardados ─────────────────────────
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR  = os.path.join(BASE_DIR, 'modelos_guardados')
CBM_PATH   = os.path.join(MODEL_DIR, 'catboost_tuneado.cbm')
CT_PATH    = os.path.join(MODEL_DIR, 'preprocesador_ct.joblib')
META_PATH  = os.path.join(MODEL_DIR, 'pipeline_meta.joblib')

# ── Variables globales para actualización dinámica ──────────
model = None
ct = None
meta = None
FEAT_NUM = []
FEAT_CAT = []
CAT_INDICES = []
GLOBAL_MEAN = 250.0
COLE_MEANS = {}
ALL_FEATURES = []
df_historico = pd.DataFrame()
CSV_HISTORICO = os.path.join(BASE_DIR, 'bogota_data.csv')

def load_all_resources():
    global model, ct, meta, FEAT_NUM, FEAT_CAT, CAT_INDICES, GLOBAL_MEAN, COLE_MEANS, ALL_FEATURES, df_historico
    print('Cargando modelo, preprocesador y metadatos...')
    try:
        model = CatBoostRegressor()
        model.load_model(CBM_PATH)
        ct = joblib.load(CT_PATH)
        meta = joblib.load(META_PATH)

        FEAT_NUM    = meta['feat_num']
        FEAT_CAT    = meta['feat_cat']
        CAT_INDICES = meta.get('cat_indices', [])
        GLOBAL_MEAN = meta['global_mean']
        COLE_MEANS  = meta.get('cole_means_train', {})
        ALL_FEATURES = FEAT_NUM + FEAT_CAT

        print(f'Modelo cargado en memoria: {len(ALL_FEATURES)} features')
        print(f'  Numéricas:    {FEAT_NUM}')
        print(f'  Categóricas:  {FEAT_CAT}')
    except Exception as e:
        print(f'ADVERTENCIA al cargar el modelo: {str(e)}')

    print('Cargando datos históricos (esto puede tardar unos segundos)...')
    if os.path.exists(CSV_HISTORICO):
        df_historico = pd.read_csv(CSV_HISTORICO)
        df_historico['AÑO'] = df_historico['PERIODO'].astype(str).str[:4].astype(int)
        print(f'Datos históricos (BOGOTÁ) cargados: {len(df_historico)} registros.')
    else:
        df_historico = pd.DataFrame()
        print('ADVERTENCIA: No se encontró el archivo CSV de datos históricos.')

# Realizar la carga inicial de recursos al arrancar el servidor
load_all_resources()

# ── Flask App ───────────────────────────────────────────────
app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    return jsonify({
        'servicio': 'API Predicción Saber 11 (CatBoost)',
        'endpoints': {
            '/predict':  'POST - Enviar features para obtener predicción',
            '/info':     'GET  - Ver features requeridas y ejemplo',
            '/stats':    'GET  - Estadísticas nacionales (Dashboard)',
            '/percentil':'GET  - Calcular percentil comparativo',
        }
    })

@app.route('/stats', methods=['GET'])
def stats():
    if df_historico.empty:
        return jsonify({'error': 'Datos históricos no disponibles'}), 503
        
    year = request.args.get('year')
    naturaleza = request.args.get('naturaleza')
    genero = request.args.get('genero')
    bilingue = request.args.get('bilingue')
    jornada = request.args.get('jornada')
    
    df_filtered = df_historico
    if year:
        df_filtered = df_filtered[df_filtered['AÑO'] == int(year)]
    if naturaleza:
        df_filtered = df_filtered[df_filtered['COLE_NATURALEZA'] == naturaleza]
    if genero:
        df_filtered = df_filtered[df_filtered['ESTU_GENERO'] == genero]
    if bilingue:
        df_filtered = df_filtered[df_filtered['COLE_BILINGUE'] == bilingue]
    if jornada:
        df_filtered = df_filtered[df_filtered['COLE_JORNADA'] == jornada]
        
    if len(df_filtered) == 0:
        return jsonify({'promedio_global': 0, 'count': 0, 'areas': {}})
        
    # Agrupaciones para gráficos adicionales
    prom_naturaleza = df_filtered.groupby('COLE_NATURALEZA')['PUNT_GLOBAL'].mean().round(1).to_dict()
    prom_bilinguismo = df_filtered.groupby('COLE_BILINGUE')['PUNT_GLOBAL'].mean().round(1).to_dict()
    
    # Histograma (Campana de Gauss) en rangos de 20 puntos
    bins = range(0, 501, 20)
    hist, bin_edges = np.histogram(df_filtered['PUNT_GLOBAL'].dropna(), bins=bins)
    histograma_puntajes = [{'rango': f'{bins[i]}-{bins[i+1]}', 'cantidad': int(hist[i])} for i in range(len(hist))]
    
    stats_data = {
        'count': len(df_filtered),
        'promedio_global': round(df_filtered['PUNT_GLOBAL'].mean(), 1),
        'areas': {
            'Matemáticas': round(df_filtered['PUNT_MATEMATICAS'].mean(), 1),
            'Inglés': round(df_filtered['PUNT_INGLES'].mean(), 1),
            'Sociales': round(df_filtered['PUNT_SOCIALES_CIUDADANAS'].mean(), 1),
            'Ciencias': round(df_filtered['PUNT_C_NATURALES'].mean(), 1),
            'Lectura': round(df_filtered['PUNT_LECTURA_CRITICA'].mean(), 1)
        },
        'distribucion_genero': df_filtered['ESTU_GENERO'].value_counts().to_dict(),
        'promedios_naturaleza': prom_naturaleza,
        'promedios_bilinguismo': prom_bilinguismo,
        'histograma_puntajes': histograma_puntajes
    }
    return jsonify(stats_data)

@app.route('/percentil', methods=['GET'])
def percentil():
    if df_historico.empty:
        return jsonify({'error': 'Datos no disponibles'}), 503
    try:
        puntaje = float(request.args.get('puntaje', 0))
        year = request.args.get('year')
        
        df_filtered = df_historico
        if year:
            df_filtered = df_filtered[df_filtered['AÑO'] == int(year)]
            
        if len(df_filtered) == 0:
            return jsonify({'percentil': 0})
            
        # Calcular porcentaje de estudiantes con puntaje menor
        menores = len(df_filtered[df_filtered['PUNT_GLOBAL'] < puntaje])
        perc = (menores / len(df_filtered)) * 100
        
        return jsonify({
            'puntaje': puntaje,
            'percentil': round(perc, 1),
            'total_estudiantes': len(df_filtered)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/info', methods=['GET'])
def info():
    """Devuelve las features requeridas y un ejemplo de request."""
    ejemplo = {}
    for f in FEAT_NUM:
        if f == 'COLE_MEAN_SCORE':
            ejemplo[f] = 250.0
        elif f == 'FAMI_ESTRATOVIVIENDA':
            ejemplo[f] = 3
        elif 'EDU' in f:
            ejemplo[f] = 6
        elif 'INDICE' in f:
            ejemplo[f] = 3
        else:
            ejemplo[f] = 1
    for f in FEAT_CAT:
        if 'GENERO' in f:
            ejemplo[f] = 'F'
        elif 'NATURALEZA' in f:
            ejemplo[f] = 'OFICIAL'
        elif 'BILINGUE' in f:
            ejemplo[f] = 'N'
        elif 'CALENDARIO' in f:
            ejemplo[f] = 'A'
        elif 'JORNADA' in f:
            ejemplo[f] = 'MAÑANA'
        elif 'CARACTER' in f:
            ejemplo[f] = 'ACADÉMICO'
        elif 'TIENE' in f:
            ejemplo[f] = 'SI'
        else:
            ejemplo[f] = 'DESCONOCIDO'

    return jsonify({
        'features_numericas': FEAT_NUM,
        'features_categoricas': FEAT_CAT,
        'total_features': len(ALL_FEATURES),
        'ejemplo_request': {
            'url': 'POST /predict',
            'body': {'features': ejemplo}
        }
    })


@app.route('/predict', methods=['POST'])
def predict():
    """
    Recibe un JSON con las features del estudiante y devuelve la predicción.
    
    Body esperado:
    {
        "features": {
            "FAMI_ESTRATOVIVIENDA": 3,
            "FAMI_INDICE_RECURSOS": 3,
            "EDU_PADRE_NUM": 6,
            "EDU_MADRE_NUM": 7,
            "EDU_PADRES_MAX": 7,
            "FAMI_ACCESO_DIGITAL": 1,
            "COLE_MEAN_SCORE": 250.0,
            "ESTU_GENERO": "F",
            "COLE_NATURALEZA": "NO OFICIAL",
            "COLE_BILINGUE": "N",
            "COLE_CALENDARIO": "A",
            "COLE_JORNADA": "COMPLETA",
            "COLE_CARACTER": "ACADÉMICO",
            "FAMI_TIENECOMPUTADOR": "SI",
            "FAMI_TIENEINTERNET": "SI",
            "FAMI_TIENELAVADORA": "SI",
            "FAMI_TIENEAUTOMOVIL": "NO"
        }
    }
    """
    try:
        data = request.get_json(force=True)
        if not data or 'features' not in data:
            return jsonify({'error': 'Se requiere un JSON con clave "features"'}), 400

        feats = data['features']

        # Validar que vengan todas las features requeridas
        faltantes = [f for f in ALL_FEATURES if f not in feats]
        if faltantes:
            return jsonify({
                'error': f'Faltan features: {faltantes}',
                'features_requeridas': ALL_FEATURES
            }), 400

        # Construir array en el orden correcto
        import pandas as pd
        row = pd.DataFrame([{f: feats[f] for f in ALL_FEATURES}])

        # Aplicar preprocesador (imputación + escalado)
        X_prep = ct.transform(row)

        # Predecir
        pred = model.predict(X_prep)
        punt_global = float(pred[0])

        return jsonify({
            'prediccion_punt_global': round(punt_global, 2),
            'nota': 'Escala aproximada: 0-500 puntos Saber 11'
        })

        return jsonify({'error': str(e)}), 500


# ── Módulo de Reentrenamiento y Carga de Datos en Segundo Plano ────────────────
import threading
import time
import traceback

training_state = {
    'status': 'idle', # idle, processing, training, success, error
    'progress': 0,
    'message': '',
    'logs': [],
    'metrics': {}
}

def log_message(msg):
    timestamp = time.strftime('%H:%M:%S')
    full_msg = f"[{timestamp}] {msg}"
    print(full_msg)
    training_state['logs'].append(full_msg)
    training_state['message'] = msg

def retrain_model_pipeline(filepath):
    try:
        training_state['status'] = 'processing'
        training_state['progress'] = 5
        training_state['logs'] = []
        training_state['metrics'] = {}
        
        log_message("Iniciando procesamiento de base de datos...")
        time.sleep(0.5)
        
        # 1. Leer dataset
        log_message("Paso 1: Cargando archivo CSV subido...")
        training_state['progress'] = 15
        df_raw = pd.read_csv(filepath, low_memory=False, encoding='utf-8')
        log_message(f"CSV cargado exitosamente. Filas totales: {len(df_raw):,}")
        
        # 2. Filtrar Bogotá
        log_message("Paso 2: Filtrando registros de la región Bogotá...")
        training_state['progress'] = 30
        
        # Normalizar strings para filtrado
        for c in df_raw.select_dtypes('object').columns:
            df_raw[c] = df_raw[c].astype(str).str.upper().str.strip().replace('NAN', np.nan)
        
        mask = pd.Series(False, index=df_raw.index)
        for col in ['COLE_DEPTO_UBICACION', 'ESTU_DEPTO_RESIDE', 'COLE_MCPIO_UBICACION', 'ESTU_MCPIO_RESIDE']:
            if col in df_raw.columns:
                mask |= df_raw[col].astype(str).str.upper().str.contains('BOGOT', na=False)
                
        df_bogota = df_raw[mask].copy() if mask.sum() > 0 else df_raw.copy()
        
        if 'PUNT_GLOBAL' not in df_bogota.columns:
            raise KeyError("La columna 'PUNT_GLOBAL' no se encuentra en el archivo subido.")
            
        df_bogota['PUNT_GLOBAL'] = pd.to_numeric(df_bogota['PUNT_GLOBAL'], errors='coerce')
        df_bogota = df_bogota.dropna(subset=['PUNT_GLOBAL']).reset_index(drop=True)
        log_message(f"Registros de Bogotá filtrados y listos: {len(df_bogota):,}")
        
        # 3. Guardar base de datos histórica reducida para el dashboard
        cols_dashboard = ['PERIODO', 'COLE_BILINGUE', 'COLE_DEPTO_UBICACION', 'COLE_JORNADA', 
                          'COLE_NATURALEZA', 'ESTU_GENERO', 'PUNT_INGLES', 'PUNT_MATEMATICAS', 
                          'PUNT_SOCIALES_CIUDADANAS', 'PUNT_C_NATURALES', 'PUNT_LECTURA_CRITICA', 'PUNT_GLOBAL']
        
        # Verificar que existan las columnas del dashboard, si no las creamos vacías/con nan para no fallar
        for c in cols_dashboard:
            if c not in df_bogota.columns:
                df_bogota[c] = np.nan
                
        df_dash = df_bogota[cols_dashboard].copy()
        df_dash.to_csv(CSV_HISTORICO, index=False)
        log_message(f"Base de datos del Dashboard actualizada en caliente ({CSV_HISTORICO})")
        
        # 4. Feature Engineering para el modelo predictivo
        log_message("Paso 3: Realizando ingeniería de variables socioeconómicas...")
        training_state['progress'] = 45
        
        # Estrato como numérico
        if 'FAMI_ESTRATOVIVIENDA' in df_bogota.columns:
            df_bogota['FAMI_ESTRATOVIVIENDA'] = pd.to_numeric(
                df_bogota['FAMI_ESTRATOVIVIENDA'].astype(str).str.extract(r'(\d+)')[0], errors='coerce'
            )
            
        # Índice de recursos (bienes del 0 al 4)
        bienes = ['FAMI_TIENECOMPUTADOR', 'FAMI_TIENEINTERNET', 'FAMI_TIENELAVADORA', 'FAMI_TIENEAUTOMOVIL']
        df_bogota['FAMI_INDICE_RECURSOS'] = sum(
            df_bogota[c].astype(str).str.upper().str.strip().isin(['S', 'SI', '1', 'TRUE']).astype(int)
            for c in bienes if c in df_bogota.columns
        )
        
        # Educación de los padres
        EDU_ORDER = {
            'NINGUNO': 0, 'PRIMARIA INCOMPLETA': 1, 'PRIMARIA COMPLETA': 2,
            'SECUNDARIA (BACHILLERATO) INCOMPLETA': 3, 'SECUNDARIA (BACHILLERATO) COMPLETA': 4,
            'TÉCNICA O TECNOLÓGICA INCOMPLETA': 5, 'TÉCNICA O TECNOLÓGICA COMPLETA': 6,
            'EDUCACIÓN PROFESIONAL INCOMPLETA': 7, 'EDUCACIÓN PROFESIONAL COMPLETA': 8,
            'POSTGRADO': 9
        }
        
        df_bogota['EDU_PADRE_NUM'] = df_bogota['FAMI_EDUCACIONPADRE'].astype(str).str.upper().str.strip().map(EDU_ORDER)
        df_bogota['EDU_MADRE_NUM'] = df_bogota['FAMI_EDUCACIONMADRE'].astype(str).str.upper().str.strip().map(EDU_ORDER)
        
        # Imputación preliminar simple antes de calcular máximo
        df_bogota['EDU_PADRE_NUM'] = df_bogota['EDU_PADRE_NUM'].fillna(4) # Bachillerato por defecto
        df_bogota['EDU_MADRE_NUM'] = df_bogota['EDU_MADRE_NUM'].fillna(4)
        df_bogota['EDU_PADRES_MAX'] = df_bogota[['EDU_PADRE_NUM', 'EDU_MADRE_NUM']].max(axis=1)
        
        # Acceso digital completo
        tiene_pc = df_bogota['FAMI_TIENECOMPUTADOR'].astype(str).str.upper().str.strip().isin(['S', 'SI'])
        tiene_net = df_bogota['FAMI_TIENEINTERNET'].astype(str).str.upper().str.strip().isin(['S', 'SI'])
        df_bogota['FAMI_ACCESO_DIGITAL'] = (tiene_pc & tiene_net).astype(int)
        
        # 5. Promedio de colegio (COLE_MEAN_SCORE)
        log_message("Paso 4: Calculando rendimiento y promedios por establecimiento educativo...")
        training_state['progress'] = 60
        
        # Intentar con DANE, si no con DANE de sede o con Nombre
        cole_col = None
        for c in ['COLE_COD_DANE_ESTABLECIMIENTO', 'COLE_CODIGO_ICFES', 'COLE_NOMBRE_ESTABLECIMIENTO']:
            if c in df_bogota.columns:
                cole_col = c
                break
                
        if cole_col:
            cole_means_train = df_bogota.groupby(cole_col)['PUNT_GLOBAL'].mean().to_dict()
            global_mean = float(df_bogota['PUNT_GLOBAL'].mean())
            df_bogota['COLE_MEAN_SCORE'] = df_bogota[cole_col].map(cole_means_train).fillna(global_mean)
        else:
            cole_col = 'COLE_MEAN_SCORE'
            cole_means_train = {}
            global_mean = float(df_bogota['PUNT_GLOBAL'].mean())
            df_bogota['COLE_MEAN_SCORE'] = global_mean
            
        log_message("Ingeniería de variables socioeconómicas y escolares finalizada.")
        
        # 6. Fit ColumnTransformer
        log_message("Paso 5: Ajustando transformadores numéricos y categóricos...")
        training_state['progress'] = 75
        
        from sklearn.pipeline import Pipeline
        from sklearn.compose import ColumnTransformer
        from sklearn.impute import SimpleImputer
        from sklearn.preprocessing import RobustScaler, OneHotEncoder
        
        num_cols = ['FAMI_ESTRATOVIVIENDA', 'FAMI_INDICE_RECURSOS', 'EDU_PADRE_NUM', 'EDU_MADRE_NUM', 'EDU_PADRES_MAX', 'FAMI_ACCESO_DIGITAL', 'COLE_MEAN_SCORE']
        cat_cols = ['ESTU_GENERO', 'COLE_NATURALEZA', 'COLE_BILINGUE', 'COLE_CALENDARIO', 'COLE_JORNADA', 'COLE_CARACTER', 'FAMI_TIENECOMPUTADOR', 'FAMI_TIENEINTERNET', 'FAMI_TIENELAVADORA', 'FAMI_TIENEAUTOMOVIL']
        
        # Asegurar presencia de las columnas de variables
        for col in num_cols + cat_cols:
            if col not in df_bogota.columns:
                df_bogota[col] = np.nan
                
        num_pipe = Pipeline([
            ('imp', SimpleImputer(strategy='median')),
            ('sc',  RobustScaler())
        ])
        cat_pipe = Pipeline([
            ('imp', SimpleImputer(strategy='most_frequent')),
            ('ohe', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
        ])
        new_ct = ColumnTransformer(
            [('num', num_pipe, num_cols), ('cat', cat_pipe, cat_cols)],
            remainder='drop'
        )
        
        # Ajustar y transformar
        X_train_T = new_ct.fit_transform(df_bogota[num_cols + cat_cols])
        
        # Guardar preprocesador ct
        joblib.dump(new_ct, CT_PATH)
        log_message("Preprocesador ColumnTransformer guardado correctamente.")
        
        # 7. Model Training
        log_message("Paso 6: Entrenando modelo regresor predictivo CatBoost... (esto puede tomar 10-25 seg)")
        training_state['status'] = 'training'
        training_state['progress'] = 85
        
        t0 = time.time()
        new_model = CatBoostRegressor(iterations=600, learning_rate=0.05, depth=6, random_seed=42, verbose=0)
        new_model.fit(X_train_T, df_bogota['PUNT_GLOBAL'].values)
        elapsed = time.time() - t0
        log_message(f"Entrenamiento completado en {elapsed:.2f} segundos.")
        
        # Calcular métricas básicas sobre set de entrenamiento
        from sklearn.metrics import mean_squared_error, r2_score
        preds = new_model.predict(X_train_T)
        rmse_val = float(np.sqrt(mean_squared_error(df_bogota['PUNT_GLOBAL'], preds)))
        r2_val = float(r2_score(df_bogota['PUNT_GLOBAL'], preds))
        
        log_message(f"Métricas obtenidas: RMSE={rmse_val:.3f} | R²={r2_val:.4f}")
        
        # Guardar el modelo en disco
        new_model.save_model(CBM_PATH)
        log_message("Pesos y arquitectura del modelo CatBoost (.cbm) guardados en disco.")
        
        # 8. Guardar Metadata
        new_meta = {
            'cole_id': cole_col,
            'global_mean': global_mean,
            'feat_num': num_cols,
            'feat_cat': cat_cols,
            'cat_indices': [len(num_cols) + i for i in range(len(cat_cols))],
            'target': 'PUNT_GLOBAL',
            'random_state': 42,
            'cole_means_train': cole_means_train,
            'best_params': {'iterations': 600, 'learning_rate': 0.05, 'depth': 6},
            'best_rmse_val': rmse_val
        }
        joblib.dump(new_meta, META_PATH)
        log_message("Metadatos y tubería de procesamiento guardados correctamente.")
        
        # 9. Recarga de recursos en caliente
        log_message("Paso 7: Recargando recursos en caliente en el hilo principal...")
        load_all_resources()
        
        # Eliminar archivo temporal subido
        if os.path.exists(filepath):
            try: os.remove(filepath)
            except: pass
            
        training_state['progress'] = 100
        training_state['status'] = 'success'
        training_state['metrics'] = {
            'rmse': round(rmse_val, 3),
            'r2': round(r2_val, 4),
            'registros': len(df_bogota),
            'tiempo': round(elapsed, 1)
        }
        log_message("¡Proceso de actualización anual completado con éxito!")
        
    except Exception as e:
        training_state['status'] = 'error'
        tb_str = traceback.format_exc()
        log_message(f"ERROR DURANTE EL ENTRENAMIENTO: {str(e)}")
        print(tb_str)
        # Intentar limpiar archivo temporal
        if os.path.exists(filepath):
            try: os.remove(filepath)
            except: pass


@app.route('/upload', methods=['POST'])
def upload():
    global training_state
    if training_state['status'] in ['processing', 'training']:
        return jsonify({'error': 'Ya hay un proceso de reentrenamiento en curso.'}), 400
    
    if 'file' not in request.files:
        return jsonify({'error': 'No se proporcionó ningún archivo en la solicitud.'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Nombre de archivo vacío.'}), 400
        
    if not file.filename.endswith('.csv'):
        return jsonify({'error': 'El archivo debe ser en formato CSV.'}), 400
        
    # Crear directorio si no existe
    os.makedirs(BASE_DIR, exist_ok=True)
    temp_path = os.path.join(BASE_DIR, 'temp_upload.csv')
    file.save(temp_path)
    
    # Iniciar hilo de fondo
    t = threading.Thread(target=retrain_model_pipeline, args=(temp_path,))
    t.daemon = True
    t.start()
    
    return jsonify({
        'message': 'Archivo recibido con éxito. Iniciando reentrenamiento del modelo en segundo plano...',
        'status': 'processing'
    })


@app.route('/training-status', methods=['GET'])
def get_status():
    return jsonify(training_state)


@app.route('/training-reset', methods=['POST'])
def reset_status():
    global training_state
    training_state = {
        'status': 'idle',
        'progress': 0,
        'message': 'Listo para una nueva carga de datos.',
        'logs': [],
        'metrics': {}
    }
    return jsonify({'message': 'Estado de entrenamiento restablecido.', 'status': 'idle'})


if __name__ == '__main__':
    print('\n' + '='*55)
    print('  API Saber 11 - CatBoost (Prod/Dev)')
    print('='*55 + '\n')
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
