import { round } from '../utils/consts';
import { PROPS_CLIENT_XY } from './consts';

export default function getCenter(pointers, props) {
  if (!props) {
    props = PROPS_CLIENT_XY;
  }
  let pointersLength = pointers.length;

  if (pointersLength === 1) {
    return {
      x: round(pointers[0][props[0]]),
      y: round(pointers[0][props[1]])
    };
  }

  let x = 0;
  let y = 0;
  let i = 0;

  while (i < pointersLength) {
    x += pointers[i][props[0]];
    y += pointers[i][props[1]];
    i++;
  }

  return {
    x: round(x / pointersLength),
    y: round(y / pointersLength)
  };
}
