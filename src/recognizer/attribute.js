import Recognizer from './constructor';
import {
  STATE_BEGAN,
  STATE_CHANGED,
  STATE_CANCELLED,
  STATE_ENDED,
  STATE_FAILED
} from './consts';
import {
  INPUT_CANCEL,
  INPUT_END
} from '../input/consts';

export default class AttrRecognizer extends Recognizer {
  constructor() {
    super(...arguments);
  }

  attrTest(input) {
    let optionPointers = this.options.pointers;
    return optionPointers === 0 || input.pointers.length === optionPointers;
  }

  process(input) {
    let { state } = this;
    let { eventType } = input;

    let isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
    let isValid = this.attrTest(input);

    if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
      return state | STATE_CANCELLED;
    } else if (isRecognized || isValid) {
      if (eventType & INPUT_END) {
        return state | STATE_ENDED;
      } else if (!(state & STATE_BEGAN)) {
        return STATE_BEGAN;
      }
      return state | STATE_CHANGED;
    }
    return STATE_FAILED;
  }
}

AttrRecognizer.prototype.defaults = {
  pointers: 1
};
