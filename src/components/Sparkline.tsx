import Svg, { Circle, Path } from 'react-native-svg';

type Props = {
  values: ReadonlyArray<number>;
  ink: string;
  height?: number;
};

export function Sparkline({ values, ink, height = 60 }: Props) {
  const W = 300;
  const H = height;
  const P = 4;
  const max = Math.max(...values, 1);
  const pts: Array<[number, number]> = values.map((v, i) => {
    const x = P + (i / (values.length - 1)) * (W - P * 2);
    const y = H - P - (v / max) * (H - P * 2);
    return [x, y];
  });
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  const last = pts[pts.length - 1]!;
  const first = pts[0]!;
  const areaPath = `${path} L${last[0]},${H} L${first[0]},${H} Z`;
  return (
    <Svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height={height}>
      <Path d={areaPath} fill={ink} opacity={0.14} />
      <Path
        d={path}
        stroke={ink}
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {pts.map((p, i) => (
        <Circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 3.5 : 2} fill={ink} />
      ))}
    </Svg>
  );
}

type StripProps = {
  daysInMonth: number;
  today: number;
  logs: Record<string, true>;
  monthKey: string;
  ink: string;
  soft: string;
};

// Tiny month-long row of dots; filled where checkin exists.
export function MonthStrip({ daysInMonth, today, logs, monthKey, ink, soft }: StripProps) {
  const W = 300;
  const H = 12;
  const cx = (i: number) => 4 + (i / (daysInMonth - 1)) * (W - 8);
  return (
    <Svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height={H}>
      {Array.from({ length: daysInMonth }).map((_, i) => {
        const day = i + 1;
        const iso = `${monthKey}-${String(day).padStart(2, '0')}`;
        const on = !!logs[iso];
        const future = day > today;
        return (
          <Circle
            key={day}
            cx={cx(i)}
            cy={H / 2}
            r={2}
            fill={on ? ink : soft}
            opacity={future ? 0.18 : on ? 1 : 0.42}
          />
        );
      })}
    </Svg>
  );
}
