import { PROPS_CLIENT_XY } from './consts';
import getDistance from './get-distance';

export default function getScale(start, end, props) {
  if (!props) {
    props = PROPS_CLIENT_XY;
  }
  return getDistance(end[0], end[1], props) / getDistance(start[0], start[1], props);
}
