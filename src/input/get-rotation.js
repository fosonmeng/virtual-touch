import getAngle from './get-angle';
import { PROPS_CLIENT_XY } from './consts';

export default function getRotation(start, end, props) {
  if (!props) {
    props = PROPS_CLIENT_XY;
  }
  return getAngle(end[1], end[0], props) + getAngle(start[1], start[0], props);
}
