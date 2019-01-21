import { now, round } from '../utils/consts';
import getCenter from './get-center';
import { PROPS_CLIENT_XY } from './consts';

export default function simpleCloneInputData(input, props) {
  if (!props) {
    props = PROPS_CLIENT_XY;
  }
  let pointers = [];
  let i = 0;
  while (i < input.pointers.length) {
    pointers[i] = {
      [props[0]]: round(input.pointers[i][props[0]]),
      [props[1]]: round(input.pointers[i][props[1]])
    };
    i++;
  }

  return {
    timeStamp: now(),
    pointers,
    center: getCenter(pointers),
    deltaX: input.deltaX,
    deltaY: input.deltaY
  };
}
