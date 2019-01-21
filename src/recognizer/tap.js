import Recognizer from './constructor';
import setTimeoutContext from '../utils/set-timeout-context.js';
import { TOUCH_ACTION_MANIPULATION } from '../touchaction/consts';
import { INPUT_START, INPUT_END } from '../input/consts';
import {
  STATE_RECOGNIZED,
  STATE_BEGAN,
  STATE_FAILED
} from './consts';
import getDistance from '../input/get-distance';

export default class TapRecognizer extends Recognizer {
  constructor() {
    super(...arguments);

    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
  }

  getTouchAction() {
    return [TOUCH_ACTION_MANIPULATION];
  }

  process(input) {
    let { options } = this;

    let validPointers = input.pointers.length === options.pointers;
    let validMovement = input.distance < options.threshold;
    let validTouchTime = input.deltaTime < options.time;

    this.reset();

    if ((input.eventType & INPUT_START) && (this.count === 0)) {
      return this.failTimeout();
    }

    if (validMovement && validTouchTime && validPointers) {
      if (input.eventType !== INPUT_END) {
        return this.failTimeout();
      }

      let validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
      let validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center, ['x', 'y']) < options.posThreshold;

      this.pTime = input.timeStamp;
      this.pCenter = input.center;

      if (!validMultiTap || !validInterval) {
        this.count = 1;
      } else {
        this.count += 1;
      }

      this._input = input;

      let tapCount = this.count % options.taps;
      if (tapCount === 0) {
        if (!this.hasRequireFailures()) {
          return STATE_RECOGNIZED;
        } else {
          this._timer = setTimeoutContext(() => {
            this.state = STATE_RECOGNIZED;
            this.tryEmit();
          }, options.interval, this);
          return STATE_BEGAN;
        }
      }
    }

    return STATE_FAILED;
  }

  failTimeout() {
    this._timer = setTimeoutContext(() => {
      this.state = STATE_FAILED;
    }, this.options.interval, this);
    return STATE_FAILED;
  }

  reset() {
    clearTimeout(this._timer);
  }

  emit() {
    if (this.state === STATE_RECOGNIZED) {
      this._input.tapCount = this.count;
      this.manager.emit(this.options.event, this._input);
    }
  }
}

TapRecognizer.prototype.defaults = {
  event: 'tap',
  pointers: 1,
  taps: 1,
  interval: 300,
  time: 250,
  threshold: 9,
  posThreshold: 10
};
