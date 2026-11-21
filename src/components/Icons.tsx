type P = { size?: number; className?: string };
const base = (size = 20) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true });

export const Arrow = ({ size = 16, className }: P) => (<svg {...base(size)} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const ArrowUpRight = ({ size = 14, className }: P) => (<svg {...base(size)} className={className}><path d="M7 17 17 7M8 7h9v9" /></svg>);
export const Chevron = ({ size = 18, dir = 'right', className }: P & { dir?: 'left' | 'right' }) => (<svg {...base(size)} className={className} style={{ transform: dir === 'left' ? 'rotate(180deg)' : undefined }}><path d="m9 6 6 6-6 6" /></svg>);
export const Menu = ({ size = 30 }: P) => (<svg {...base(size)} strokeWidth={1.4}><path d="M3 7h18M3 12h18M3 17h18" /></svg>);
export const Close = ({ size = 28 }: P) => (<svg {...base(size)} strokeWidth={1.4}><path d="M5 5l14 14M19 5 5 19" /></svg>);
export const Globe = ({ size = 16 }: P) => (<svg {...base(size)}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>);
export const Calendar = ({ size = 18 }: P) => (<svg {...base(size)}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>);
export const User = ({ size = 16 }: P) => (<svg {...base(size)}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>);
export const Check = ({ size = 16 }: P) => (<svg {...base(size)} strokeWidth={2}><path d="m5 12 4 4 10-10" /></svg>);
export const Pin = ({ size = 16 }: P) => (<svg {...base(size)}><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>);
export const Mail = ({ size = 16 }: P) => (<svg {...base(size)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>);
export const Plus = ({ size = 20 }: P) => (<svg {...base(size)}><path d="M12 5v14M5 12h14" /></svg>);
export const Star = ({ size = 14 }: P) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3 6.5 7 .8-5.2 4.8 1.4 7-6.2-3.6-6.2 3.6 1.4-7L2 9.3l7-.8Z" /></svg>);
export const WhatsApp = ({ size = 22 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2-.2-.2-.4-.3Z" /></svg>
);
export const Instagram = ({ size = 18 }: P) => (<svg {...base(size)}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></svg>);

/** Sol con franjas del logo oficial de Tama Lodge */
export const Sun = ({ size = 34, id = 'sun' }: P & { id?: string }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
    <defs>
      <linearGradient id={`${id}G`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F2B53A" /><stop offset="1" stopColor="#FBE3A0" /></linearGradient>
      <clipPath id={`${id}C`}><circle cx="20" cy="20" r="19" /></clipPath>
    </defs>
    <g clipPath={`url(#${id}C)`} fill={`url(#${id}G)`}>
      <rect x="0" y="0" width="40" height="12" /><rect x="0" y="13.5" width="40" height="4" /><rect x="0" y="19" width="40" height="3.2" />
      <rect x="0" y="23.6" width="40" height="2.6" /><rect x="0" y="27.6" width="40" height="2" /><rect x="0" y="31" width="40" height="1.6" />
      <rect x="0" y="34" width="40" height="1.2" /><rect x="0" y="36.4" width="40" height=".9" />
    </g>
  </svg>
);
