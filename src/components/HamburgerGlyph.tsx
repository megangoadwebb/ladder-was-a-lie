import Svg, { Path } from 'react-native-svg';

type Props = { color: string; size?: number };

export function HamburgerGlyph({ color, size = 22 }: Props) {
  const w = size;
  const h = (size / 22) * 20;
  return (
    <Svg width={w} height={h} viewBox="0 0 22 20" fill="none">
      <Path
        d="M2 9.5L11 2L20 9.5V18C20 18.5523 19.5523 19 19 19H14V13H8V19H3C2.44772 19 2 18.5523 2 18V9.5Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
