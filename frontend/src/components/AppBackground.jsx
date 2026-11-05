const PINES = [
  { x: -30, scale: 2.55 },
  { x: 34, scale: 1.85 },
  { x: 88, scale: 3.05 },
  { x: 148, scale: 2.2 },
  { x: 205, scale: 1.6 },
  { x: 266, scale: 2.85 },
  { x: 330, scale: 2.05 },
  { x: 392, scale: 3.2 },
  { x: 458, scale: 2.35 },
  { x: 518, scale: 1.75 },
  { x: 580, scale: 2.95 },
  { x: 642, scale: 2.15 },
  { x: 706, scale: 3.3 },
  { x: 772, scale: 2.25 },
  { x: 834, scale: 1.7 },
  { x: 896, scale: 2.7 },
  { x: 958, scale: 2.0 },
  { x: 1020, scale: 3.1 },
  { x: 1082, scale: 2.2 },
  { x: 1144, scale: 1.8 },
  { x: 1206, scale: 2.9 },
  { x: 1268, scale: 2.0 },
  { x: 1330, scale: 3.2 },
  { x: 1392, scale: 2.35 },
  { x: 1450, scale: 2.75 },
];

const TREE_PATH = 'M34 0L58 44H47L64 74H52L70 100H-2L16 74H4L21 44H10L34 0Z';

/**
 * Layered scenic background shared by both screens.
 *
 * The login screen uses the daylight forest photograph behind SVG ridges and a
 * pine line so the composition keeps its "dark tree silhouettes" character at
 * every screen size. The dashboard deliberately skips the photograph and uses a
 * calmer gradient, keeping the ridges and grain for continuity.
 */
export default function AppBackground({ variant = 'default' }) {
  const showPhoto = variant === 'login';

  return (
    <div className={`app-bg app-bg--${variant}`} aria-hidden="true">
      {showPhoto && <div className="app-bg__photo app-bg__photo--day" />}
      <div className="app-bg__veil" />

      <svg
        className="app-bg__ridges"
        viewBox="0 0 1440 420"
        preserveAspectRatio="xMidYMax slice"
        focusable="false"
      >
        <path
          className="ridge ridge--far"
          d="M0 252L85 208L168 232L258 164L348 222L444 176L538 236L634 152L728 226L820 186L914 240L1008 178L1102 230L1196 190L1292 246L1378 206L1440 236V420H0V252Z"
        />
        <path
          className="ridge ridge--near"
          d="M0 312L82 262L164 302L252 242L340 306L432 266L524 316L614 256L704 312L794 276L884 322L974 252L1064 306L1160 270L1252 322L1342 282L1440 312V420H0V312Z"
        />

        <g className="pines">
          {PINES.map(({ x, scale }) => (
            <path
              key={`${x}-${scale}`}
              d={TREE_PATH}
              transform={`translate(${x} ${420 - 100 * scale}) scale(${scale})`}
            />
          ))}
        </g>

        <g className="pines pines--foreground">
          <path d={TREE_PATH} transform="translate(-58 8) scale(4.1)" />
          <path d={TREE_PATH} transform="translate(1372 -10) scale(4.3)" />
        </g>
      </svg>

      <div className="app-bg__vignette" />
      <div className="app-bg__grain" />
    </div>
  );
}
