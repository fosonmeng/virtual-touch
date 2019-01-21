import inStr from '../utils/in-str';
import {
  TOUCH_ACTION_NONE,
  TOUCH_ACTION_PAN_X,
  TOUCH_ACTION_PAN_Y,
  TOUCH_ACTION_MANIPULATION,
  TOUCH_ACTION_AUTO
} from './consts';

export default function cleanTouchActions(actions) {
  if (inStr(actions, TOUCH_ACTION_NONE)) {
    return TOUCH_ACTION_NONE;
  }

  let hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
  let hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

  if (hasPanX && hasPanY) {
    return TOUCH_ACTION_NONE;
  }

  if (hasPanX || hasPanY) {
    return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
  }

  return TOUCH_ACTION_AUTO;
}
