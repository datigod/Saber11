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

# ── Cargar modelo, preprocesador y metadatos ────────────────
print('Cargando modelo...')
model = CatBoostRegressor()
model.load_model(CBM_PATH)
ct   = joblib.load(CT_PATH)
meta = joblib.load(META_PATH)

FEAT_NUM    = meta['feat_num']
FEAT_CAT    = meta['feat_cat']
CAT_INDICES = meta['cat_indices']
GLOBAL_MEAN = meta['global_mean']
COLE_MEANS  = meta.get('cole_means_train', {})
ALL_FEATURES = FEAT_NUM + FEAT_CAT

print(f'Modelo cargado: {len(ALL_FEATURES)} features')
print(f'  Numéricas:    {FEAT_NUM}')
print(f'  Categóricas:  {FEAT_CAT}')

# ── Cargar datos históricos para el Dashboard ────────────────
print('Cargando datos históricos (esto puede tardar unos segundos)...')
CSV_HISTORICO = os.path.join(BASE_DIR, 'bogota_data.csv')

if os.path.exists(CSV_HISTORICO):
    df_historico = pd.read_csv(CSV_HISTORICO)
    # Extraer el año del periodo (ej. 20171 -> 2017)
    df_historico['AÑO'] = df_historico['PERIODO'].astype(str).str[:4].astype(int)
    print(f'Datos históricos (BOGOTÁ) cargados: {len(df_historico)} registros.')
else:
    df_historico = pd.DataFrame()
    print('ADVERTENCIA: No se encontró el archivo CSV de datos históricos.')

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

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print('\n' + '='*55)
    print('  API Saber 11 - CatBoost (Prod/Dev)')
    print('='*55 + '\n')
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
