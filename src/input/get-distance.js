import { PROPS_CLIENT_XY } from './consts';

export default function getDistance(p1, p2, props) {
  if (!props) {
    props = PROPS_CLIENT_XY;
  }
  let x = p2[props[0]] - p1[props[0]];
  let y = p2[props[1]] - p1[props[1]];

  return Math.sqrt((x * x) + (y * y));
}
