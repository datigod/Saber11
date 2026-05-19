export const LogoIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <mask id="logo-cutout">
        {/* Everything under white stays, everything under black is cut out */}
        <rect width="100" height="100" fill="white" />
        
        {/* Cutout for Arrow Line */}
        <line x1="32" y1="68" x2="88" y2="12" stroke="black" strokeWidth="20" strokeLinecap="round" />
        {/* Cutout for Arrow Circle */}
        <circle cx="32" cy="68" r="18" fill="black" />
        {/* Cutout for Arrow Head */}
        <polygon points="65,8 92,8 92,35" fill="black" stroke="black" strokeWidth="8" strokeLinejoin="round" />
        
        {/* Cutout for Cyan Dot */}
        <circle cx="20" cy="80" r="12" fill="black" />
      </mask>
    </defs>

    {/* Masked Background Shapes */}
    <g mask="url(#logo-cutout)">
      {/* Dark blue shape */}
      <rect x="5" y="5" width="65" height="35" rx="12" fill="#0B2D6B" />
      <rect x="5" y="5" width="35" height="75" rx="12" fill="#0B2D6B" />
      
      {/* Green shape */}
      <rect x="35" y="60" width="60" height="35" rx="12" fill="#8DD400" />
      <rect x="60" y="35" width="35" height="60" rx="12" fill="#8DD400" />
    </g>

    {/* Foreground Shapes */}
    {/* Arrow line */}
    <line x1="32" y1="68" x2="85" y2="15" stroke="#1155F2" strokeWidth="10" strokeLinecap="round" />
    {/* Arrow circle */}
    <circle cx="32" cy="68" r="11" fill="#1155F2" />
    {/* Arrow head */}
    <polygon points="68,15 85,15 85,32" fill="#1155F2" />
    
    {/* Cyan dot */}
    <circle cx="20" cy="80" r="7" fill="#22C5F0" />
  </svg>
);
