function Mascot({ temperature, precipitationProb, windSpeed, aqi }) {
  const isHot = temperature >= 32;
  const isRainy = precipitationProb >= 70;
  const isDrizzly = precipitationProb >= 30 && precipitationProb < 70;
  const isWindy = windSpeed >= 40;
  const isPoorAir = aqi >= 101;

  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      {/* soft blob backdrop */}
      <ellipse cx="70" cy="75" rx="55" ry="50" fill="#FFE9B8" />

      {/* body */}
      <circle cx="70" cy="70" r="42" fill="#FFD873" stroke="#3B2E4A" strokeWidth="3" />

      {/* face */}
      {isPoorAir ? (
        // mask covers mouth area when air quality is poor
        <>
          <circle cx="56" cy="65" r="4" fill="#3B2E4A" />
          <circle cx="84" cy="65" r="4" fill="#3B2E4A" />
          <rect x="50" y="78" width="40" height="16" rx="8" fill="#FFFFFF" stroke="#3B2E4A" strokeWidth="2" />
        </>
      ) : isHot ? (
        // sunglasses when hot
        <>
          <rect x="46" y="58" width="20" height="12" rx="6" fill="#3B2E4A" />
          <rect x="74" y="58" width="20" height="12" rx="6" fill="#3B2E4A" />
          <rect x="66" y="62" width="8" height="3" fill="#3B2E4A" />
          <path d="M56 82 Q70 90 84 82" stroke="#3B2E4A" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : (
        // default happy face
        <>
          <circle cx="56" cy="65" r="4" fill="#3B2E4A" />
          <circle cx="84" cy="65" r="4" fill="#3B2E4A" />
          <path d="M56 82 Q70 92 84 82" stroke="#3B2E4A" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* umbrella when rainy */}
      {isRainy && (
        <g transform="translate(95, 20)">
          <path d="M0 20 A20 20 0 0 1 40 20 Z" fill="#FF8C69" stroke="#3B2E4A" strokeWidth="2" />
          <line x1="20" y1="20" x2="20" y2="45" stroke="#3B2E4A" strokeWidth="2" />
          <path d="M20 45 Q26 48 20 50" stroke="#3B2E4A" strokeWidth="2" fill="none" />
        </g>
      )}

      {/* small rain drops when drizzly */}
      {isDrizzly && !isRainy && (
        <g stroke="#AEE3F5" strokeWidth="3" strokeLinecap="round">
          <line x1="30" y1="15" x2="26" y2="25" />
          <line x1="45" y1="10" x2="41" y2="20" />
        </g>
      )}

      {/* wind lines when windy */}
      {isWindy && (
        <g stroke="#3B2E4A" strokeWidth="2" strokeLinecap="round" opacity="0.5">
          <line x1="5" y1="60" x2="20" y2="60" />
          <line x1="0" y1="70" x2="18" y2="70" />
          <line x1="5" y1="80" x2="20" y2="80" />
        </g>
      )}

      {/* scarf when mild/cool */}
      {temperature < 26 && (
        <path d="M45 95 Q70 108 95 95 L95 102 Q70 115 45 102 Z" fill="#FF8C69" stroke="#3B2E4A" strokeWidth="2" />
      )}
    </svg>
  );
}

export default Mascot;