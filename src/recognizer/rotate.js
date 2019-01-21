import AttrRecognizer from './attribute';
import { TOUCH_ACTION_NONE } from '../touchaction/consts';
import { STATE_BEGAN } from '../recognizer/consts';
import { abs } from '../utils/consts';

export default class RotateRecognizer extends AttrRecognizer {
  constructor() {
    super(...arguments);
  }

  getTouchAction() {
    return [TOUCH_ACTION_NONE];
  }

  attrTest(input) {
    return super.attrTest(input) &&
        (abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
  }
}

RotateRecognizer.prototype.defaults = {
  event: 'rotate',
  threshold: 0,
  pointers: 2
};
