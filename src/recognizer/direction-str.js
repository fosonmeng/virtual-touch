import {
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  DIRECTION_UP,
  DIRECTION_DOWN
} from '../input/consts';

export default function directionStr(direction) {
  if (direction & DIRECTION_DOWN) {
    return 'down';
  } else if (direction & DIRECTION_UP) {
    return 'up';
  } else if (direction & DIRECTION_LEFT) {
    return 'left';
  } else if (direction & DIRECTION_RIGHT) {
    return 'right';
  }
  return '';
}
