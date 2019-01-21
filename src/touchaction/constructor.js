import {
  TOUCH_ACTION_COMPUTE,
  TOUCH_ACTION_NONE,
  TOUCH_ACTION_PAN_X,
  TOUCH_ACTION_PAN_Y,
} from './consts';
import {
  DIRECTION_VERTICAL,
  DIRECTION_HORIZONTAL,
} from '../input/consts';
import each from '../utils/each';
import valOrFunc from '../utils/val-or-func';
import inStr from '../utils/in-str';
import cleanTouchActions from './clean-touch-actions.js';

export default class TouchAction {
  constructor(manager, value) {
    this.manager = manager;
    this.set(value);
  }

  set(value) {
    if (value === TOUCH_ACTION_COMPUTE) {
      value = this.compute();
    }

    this.actions = value.toLowerCase().trim();
  }

  update() {
    this.set(this.manager.options.touchAction);
  }

  compute() {
    let actions = [];
    each(this.manager.recognizers, (recognizer) => {
      if (valOrFunc(recognizer.options.enable, [recognizer])) {
        Array.prototype.push.apply(actions, recognizer.getTouchAction());
      }
    });
    return cleanTouchActions(actions.join(' '));
  }

  preventDefaults(input) {
    let { srcEvent } = input;
    let direction = input.offsetDirection;

    if (this.manager.session.prevented) {
      srcEvent.preventDefault();
      return;
    }

    let { actions } = this;
    let hasNone = inStr(actions, TOUCH_ACTION_NONE);
    let hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
    let hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);

    if (hasNone) {
      let isTapPointer = input.pointers.length === 1;
      let isTapMovement = input.distance < 2;
      let isTapTouchTime = input.deltaTime < 250;

      if (isTapPointer && isTapMovement && isTapTouchTime) {
        return;
      }
    }

    if (hasPanX && hasPanY) {
      return;
    }

    if (hasNone || (
      (hasPanX && direction & DIRECTION_HORIZONTAL) ||
      (hasPanY && direction & DIRECTION_VERTICAL)
    )) {
      return this.preventSrc(srcEvent);
    }
  }

  preventSrc(srcEvent) {
    this.manager.session.prevented = true;
    srcEvent.preventDefault();
  }
}
