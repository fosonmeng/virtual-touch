import Recognizer from './constructor';
import {
  STATE_RECOGNIZED,
  STATE_FAILED
} from './consts';
import { now } from '../utils/consts';
import setTimeoutContext from '../utils/set-timeout-context.js';
import { TOUCH_ACTION_AUTO } from '../touchaction/consts';
import {
  INPUT_START,
  INPUT_END,
  INPUT_CANCEL
} from '../input/consts';

export default class PressRecognizer extends Recognizer {
  constructor() {
    super(...arguments);
    this._timer = null;
    this._input = null;
  }

  getTouchAction() {
    return [TOUCH_ACTION_AUTO];
  }

  process(input) {
    let { options } = this;
    let validPointers = input.pointers.length === options.pointers;
    let validMovement = input.distance < options.threshold;
    let validTime = input.deltaTime > options.time;

    this._input = input;

    if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
      this.reset();
    } else if (input.eventType & INPUT_START) {
      this.reset();
      this._timer = setTimeoutContext(() => {
        this.state = STATE_RECOGNIZED;
        this.tryEmit();
      }, options.time, this);
    } else if (input.eventType & INPUT_END) {
      return STATE_RECOGNIZED;
    }
    return STATE_FAILED;
  }

  reset() {
    clearTimeout(this._timer);
  }

  emit(input) {
    if (this.state !== STATE_RECOGNIZED) {
      return;
    }

    if (input && (input.eventType & INPUT_END)) {
      this.manager.emit(this.options.event + 'up', input);
    } else {
      this._input.timeStamp = now();
      this.manager.emit(this.options.event, this._input);
    }
  }
}

PressRecognizer.prototype.defaults = {
  event: 'press',
  pointers: 1,
  time: 251,
  threshold: 9
};
