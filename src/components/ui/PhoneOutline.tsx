const PhoneOutline = () => (
  <svg
    viewBox="0 0 360 640"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute inset-0 w-full h-full pointer-events-none z-10"
    style={{ filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.1))' }}
  >
    {/* Phone outline */}
    <rect x="2" y="2" width="356" height="636" rx="20" stroke="#fff" strokeWidth="4" fill="none" />

    {/* MusiNova logo (placeholder, replace with your logo SVG) */}
    <g>
      <circle cx="32" cy="36" r="16" fill="white" stroke="#fff" strokeWidth="2" />
      <image href="logo.svg" x="16" y="20" width="32" height="32" />
      {/* <text x="32" y="42" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#3B3B3B" fontFamily="sans-serif">M</text> */}
    </g>

    {/* Header separator line */}
    <line x1="2" y1="65" x2="356" y2="65" stroke="#fff" strokeWidth="4" opacity="1" />

    {/* Footer seperator line */}
    <line x1="2" y1="550" x2="356" y2="550" stroke="#fff" strokeWidth="4" opacity="1" />

    {/* Bottom left icons - spaced in a row */}
    {/* Heart */}
    <path
      d="M36 590
         c-6 -7, 2 -18, 10 -13
         c8 -5, 16 6, 10 13
         l-10 10
         z"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
    />
    {/* Message box */}
    {/* <rect x="76" y="581.2" width="24" height="19.2" rx="3.6" stroke="#fff" strokeWidth="2" fill="none" /> */}
    {/* <polyline points="78.4,583.2 90,594 101.6,583.2" stroke="#fff" strokeWidth="2" fill="none" /> */}
    {/* Send arrow */}
    {/* <polygon points="108.8,581.2 132,592 108.8,602.8 113.6,592" fill="none" stroke="#fff" strokeWidth="2" /> */}

    {/* Bookmark */}
    <path
      d="M320 580
         v20
         l-10 -5
         l-10 5
         v-20
         a5 5 0 0 1 5 -5
         h10
         a5 5 0 0 1 5 5
         z"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
    />
  </svg>
);

export default PhoneOutline;