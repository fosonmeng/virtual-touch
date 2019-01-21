import AttrRecognizer from './attribute';
import { abs } from '../utils/consts';
import {
  DIRECTION_HORIZONTAL,
  DIRECTION_VERTICAL,
  INPUT_END
} from '../input/consts';
import PanRecognizer from './pan';
import directionStr from './direction-str';

export default class SwipeRecognizer extends AttrRecognizer {
  constructor() {
    super(...arguments);
  }

  getTouchAction() {
    return PanRecognizer.prototype.getTouchAction.call(this);
  }

  attrTest(input) {
    let { direction } = this.options;
    let velocity;

    if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
      velocity = input.overallVelocity;
    } else if (direction & DIRECTION_HORIZONTAL) {
      velocity = input.overallVelocityX;
    } else if (direction & DIRECTION_VERTICAL) {
      velocity = input.overallVelocityY;
    }

    return super.attrTest(input) &&
        direction & input.offsetDirection &&
        input.distance > this.options.threshold &&
        input.maxPointers === this.options.pointers &&
        abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
  }

  emit(input) {
    let direction = directionStr(input.offsetDirection);
    if (direction) {
      this.manager.emit(this.options.event + direction, input);
    }

    this.manager.emit(this.options.event, input);
  }
}

SwipeRecognizer.prototype.defaults = {
  event: 'swipe',
  threshold: 10,
  velocity: 0.3,
  direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
  pointers: 1
};
