import React from 'react'

interface IconProps {
  size?: number;
  className?: string;
}

export const LionIcon = ({ size = 100, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    {/* Mane with organic points */}
    <path d="M50 10 Q65 10 75 25 T85 50 T75 75 T50 90 T25 75 T15 50 T25 25 Z" fill="#D2691E" />
    <circle cx="50" cy="55" r="32" fill="#E67E22" />
    {/* Face */}
    <circle cx="50" cy="55" r="25" fill="#FFCC33" />
    {/* Muzzle */}
    <circle cx="44" cy="65" r="8" fill="#FFF" opacity="0.5" />
    <circle cx="56" cy="65" r="8" fill="#FFF" opacity="0.5" />
    <path d="M48 60 L52 60 L50 64 Z" fill="#333" />
    {/* Eyes */}
    <circle cx="40" cy="52" r="3" fill="#333" />
    <circle cx="60" cy="52" r="3" fill="#333" />
    <path d="M42 72 Q50 76 58 72" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
)

export const ElephantIcon = ({ size = 100, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    {/* Ears */}
    <ellipse cx="30" cy="45" rx="18" ry="22" fill="#95A5A6" />
    <ellipse cx="70" cy="45" rx="18" ry="22" fill="#95A5A6" />
    {/* Body/Head */}
    <path d="M25 45 Q25 20 50 20 T75 45 Q75 75 50 75 T25 45" fill="#BDC3C7" />
    {/* Trunk */}
    <path d="M45 60 Q45 85 65 85" stroke="#BDC3C7" strokeWidth="12" fill="none" strokeLinecap="round" />
    {/* Eyes */}
    <circle cx="40" cy="45" r="2.5" fill="#333" />
    <circle cx="60" cy="45" r="2.5" fill="#333" />
    {/* Tusks */}
    <path d="M38 65 Q35 75 30 72" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M62 65 Q65 75 70 72" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
)

export const GiraffeIcon = ({ size = 100, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    {/* Neck */}
    <path d="M42 30 L58 30 L62 90 L38 90 Z" fill="#F1C40F" />
    {/* Head */}
    <rect x="40" y="15" width="35" height="22" rx="10" fill="#F1C40F" />
    {/* Horns (Ossicones) */}
    <path d="M48 15 L48 8 M62 15 L62 8" stroke="#A0522D" strokeWidth="3" strokeLinecap="round" />
    {/* Spots */}
    <circle cx="50" cy="45" r="4" fill="#A0522D" opacity="0.7" />
    <circle cx="46" cy="65" r="5" fill="#A0522D" opacity="0.7" />
    <circle cx="54" cy="80" r="4" fill="#A0522D" opacity="0.7" />
    {/* Face details */}
    <circle cx="65" cy="22" r="2.5" fill="#333" />
    <rect x="70" y="28" width="6" height="4" rx="2" fill="#333" opacity="0.2" />
  </svg>
)

export const ZebraIcon = ({ size = 100, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    <rect x="25" y="30" width="50" height="55" rx="20" fill="#FFF" stroke="#ECF0F1" strokeWidth="1" />
    {/* Patterned Stripes */}
    <path d="M25 40 H75 M25 55 H75 M25 70 H75" stroke="#2C3E50" strokeWidth="6" strokeDasharray="10 5" />
    {/* Head */}
    <path d="M60 40 Q85 40 85 25 Q85 10 70 10 Q55 10 55 25" fill="#FFF" stroke="#2C3E50" strokeWidth="1" />
    <path d="M75 10 L75 25 M65 10 L65 25" stroke="#2C3E50" strokeWidth="4" />
    <circle cx="75" cy="20" r="2" fill="#333" />
    <path d="M85 25 Q85 35 75 35" stroke="#2C3E50" strokeWidth="4" fill="none" />
  </svg>
)

export const MonkeyIcon = ({ size = 100, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    {/* Ears */}
    <circle cx="25" cy="50" r="12" fill="#8B4513" />
    <circle cx="75" cy="50" r="12" fill="#8B4513" />
    <circle cx="25" cy="50" r="7" fill="#E9967A" />
    <circle cx="75" cy="50" r="7" fill="#E9967A" />
    {/* Head */}
    <circle cx="50" cy="50" r="32" fill="#8B4513" />
    {/* Face Mask */}
    <path d="M50 30 Q30 30 30 55 Q30 75 50 75 Q70 75 70 55 Q70 30 50 30" fill="#FFDAB9" />
    {/* Features */}
    <circle cx="42" cy="48" r="3" fill="#333" />
    <circle cx="58" cy="48" r="3" fill="#333" />
    <path d="M47 58 Q50 60 53 58" stroke="#333" strokeWidth="1" fill="none" />
    <path d="M42 65 Q50 72 58 65" stroke="#8B4513" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
)

export const HippoIcon = ({ size = 100, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    <rect x="20" y="45" width="60" height="40" rx="20" fill="#7F8C8D" />
    <path d="M25 45 Q25 15 50 15 Q75 15 75 45" fill="#95A5A6" />
    <circle cx="35" cy="20" r="5" fill="#7F8C8D" />
    <circle cx="65" cy="20" r="5" fill="#7F8C8D" />
    {/* Snout */}
    <rect x="30" y="50" width="40" height="25" rx="12" fill="#BDC3C7" />
    {/* Nostrils */}
    <circle cx="42" cy="58" r="3" fill="#7F8C8D" />
    <circle cx="58" cy="58" r="3" fill="#7F8C8D" />
    {/* Eyes */}
    <circle cx="40" cy="35" r="2.5" fill="#333" />
    <circle cx="60" cy="35" r="2.5" fill="#333" />
  </svg>
)

export const RhinoIcon = ({ size = 100, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    <path d="M20 75 Q20 40 50 40 Q80 40 80 75 Z" fill="#95A5A6" />
    <path d="M70 45 L90 45 L75 25 Z" fill="#BDC3C7" /> {/* Main Horn */}
    <path d="M65 45 L75 45 L70 35 Z" fill="#BDC3C7" /> {/* Small Horn */}
    <circle cx="45" cy="55" r="3" fill="#333" />
    <rect x="25" y="75" width="10" height="15" fill="#7F8C8D" />
    <rect x="65" y="75" width="10" height="15" fill="#7F8C8D" />
  </svg>
)

export const CrocodileIcon = ({ size = 100, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    <path d="M10 60 Q50 40 90 60 L85 75 Q50 85 15 75 Z" fill="#27AE60" />
    {/* Ridges */}
    <path d="M25 53 L30 45 L35 52 L40 45 L45 52 L50 45" fill="#219150" />
    <circle cx="75" cy="58" r="3" fill="#333" />
    {/* Teeth */}
    <path d="M30 75 L33 70 L36 75 L39 70 L42 75" fill="white" />
  </svg>
)

export const ParrotIcon = ({ size = 100, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    <circle cx="50" cy="40" r="22" fill="#E74C3C" />
    <path d="M50 62 Q75 62 75 90 H25 Q25 62 50 62" fill="#E74C3C" />
    {/* Beak */}
    <path d="M68 35 Q85 40 68 55 Z" fill="#F1C40F" />
    {/* Wing */}
    <path d="M35 65 Q20 75 35 85" stroke="#2980B9" strokeWidth="8" fill="none" strokeLinecap="round" />
    <circle cx="60" cy="35" r="4" fill="white" />
    <circle cx="61" cy="35" r="2" fill="black" />
  </svg>
)

export const FlamingoIcon = ({ size = 100, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    <path d="M40 50 Q65 50 65 80" stroke="#FF85A2" strokeWidth="12" fill="none" strokeLinecap="round" />
    <circle cx="40" cy="50" r="18" fill="#FF85A2" />
    {/* Neck */}
    <path d="M52 45 Q75 10 80 40" stroke="#FF85A2" strokeWidth="5" fill="none" strokeLinecap="round" />
    {/* Head */}
    <circle cx="80" cy="40" r="8" fill="#FF85A2" />
    <path d="M85 40 L95 45 L85 50 Z" fill="#333" />
    {/* Legs */}
    <path d="M55 80 L55 95 M65 80 L65 95" stroke="#FF85A2" strokeWidth="2" />
  </svg>
)

export const KangarooIcon = ({ size = 100, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    <path d="M20 85 Q40 85 50 60 Q60 30 80 30" stroke="#D2691E" strokeWidth="12" fill="none" strokeLinecap="round" />
    <circle cx="80" cy="30" r="10" fill="#D2691E" />
    <path d="M78 22 L75 10 M82 22 L85 10" stroke="#D2691E" strokeWidth="3" strokeLinecap="round" />
    <circle cx="84" cy="28" r="2" fill="#333" />
    <path d="M45 65 Q55 75 45 85" fill="#E67E22" opacity="0.6" /> {/* Pouch area */}
  </svg>
)

export const SlothIcon = ({ size = 100, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    <circle cx="50" cy="50" r="32" fill="#966F33" />
    <path d="M30 50 Q50 35 70 50 Q70 70 50 70 Q30 70 30 50" fill="#D2B48C" />
    {/* Eye Patches */}
    <ellipse cx="40" cy="50" rx="8" ry="5" fill="#634721" transform="rotate(-10 40 50)" />
    <ellipse cx="60" cy="50" rx="8" ry="5" fill="#634721" transform="rotate(10 60 50)" />
    <circle cx="40" cy="50" r="2" fill="#FFF" />
    <circle cx="60" cy="50" r="2" fill="#FFF" />
    <path d="M46 62 Q50 65 54 62" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
)

export const getAnimalIcon = (tableNum: number, size = 100) => {
  switch (tableNum) {
    case 1: return <LionIcon size={size} />;
    case 2: return <ElephantIcon size={size} />;
    case 3: return <GiraffeIcon size={size} />;
    case 4: return <ZebraIcon size={size} />;
    case 5: return <MonkeyIcon size={size} />;
    case 6: return <HippoIcon size={size} />;
    case 7: return <RhinoIcon size={size} />;
    case 8: return <CrocodileIcon size={size} />;
    case 9: return <ParrotIcon size={size} />;
    case 10: return <FlamingoIcon size={size} />;
    case 11: return <KangarooIcon size={size} />;
    case 12: return <SlothIcon size={size} />;
    default: return <LionIcon size={size} />;
  }
}

export const getAnimalName = (tableNum: number, plural = false) => {
  const names = [
    'Lion', 'Elephant', 'Giraffe', 'Zebra', 'Monkey', 'Hippo', 
    'Rhino', 'Crocodile', 'Parrot', 'Flamingo', 'Kangaroo', 'Sloth'
  ];
  const idx = (tableNum >= 1 && tableNum <= 12) ? tableNum - 1 : 0;
  const name = names[idx];
  
  if (!plural) return name;
  if (name === 'Rhino') return 'Rhinos';
  if (name === 'Monkey') return 'Monkeys';
  if (name === 'Flamingo') return 'Flamingos';
  if (name === 'Hippo') return 'Hippos';
  if (name === 'Crocodile') return 'Crocodiles';
  if (name === 'Kangaroo') return 'Kangaroos';
  return name + 's';
}