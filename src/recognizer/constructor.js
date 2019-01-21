import {
  STATE_POSSIBLE,
  STATE_BEGAN,
  STATE_CHANGED,
  STATE_ENDED,
  STATE_RECOGNIZED,
  STATE_FAILED,
  STATE_CANCELLED
} from './consts';
import stateStr from './state-str';

import assign from '../utils/assign';
import uniqueId from '../utils/unique-id';
import invokeArrayArg from '../utils/invoke-array-arg.js';
import inArray from '../utils/in-array.js';
import valOrFunc from '../utils/val-or-func';

export default class Recognizer {
  constructor(options) {
    this.options = assign({}, this.defaults, options || {});

    this.id = uniqueId();

    this.manager = null;

    if (typeof this.options.enable === 'undefined') {
      this.options.enable = true;
    }

    this.state = STATE_POSSIBLE;
    this.simultaneous = {};
    this.requireFail = [];
  }

  set(options) {
    assign(this.options, options);

    this.manager && this.manager.touchAction.update();
    return this;
  }

  recognizeWith(otherRecognizer) {
    if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
      return this;
    }

    let { simultaneous } = this;
    if (this.manager) {
      otherRecognizer = this.manager.get(otherRecognizer);
    }
    if (!simultaneous[otherRecognizer.id]) {
      simultaneous[otherRecognizer.id] = otherRecognizer;
      otherRecognizer.recognizeWith(this);
    }
    return this;
  }

  dropRecognizeWith(otherRecognizer) {
    if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
      return this;
    }

    if (this.manager) {
      otherRecognizer = this.manager.get(otherRecognizer);
    }
    delete this.simultaneous[otherRecognizer.id];
    return this;
  }

  requireFailure(otherRecognizer) {
    if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
      return this;
    }

    let { requireFail } = this;
    if (this.manager) {
      otherRecognizer = this.manager.get(otherRecognizer);
    }
    if (inArray(requireFail, otherRecognizer) < 0) {
      requireFail.push(otherRecognizer);
      otherRecognizer.requireFailure(this);
    }
    return this;
  }

  dropRequireFailure(otherRecognizer) {
    if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
      return this;
    }

    if (this.manager) {
      otherRecognizer = this.manager.get(otherRecognizer);
    }
    let { requireFail } = this;
    const index = inArray(requireFail, otherRecognizer);
    if (index > -1) {
      this.requireFail.splice(index, 1);
    }
    return this;
  }

  hasRequireFailures() {
    return !!this.requireFail.length;
  }

  canRecognizeWith(otherRecognizer) {
    return !!this.simultaneous[otherRecognizer.id];
  }

  emit(input) {
    let { state } = this;
    const em = (evt) => {
      this.manager.emit(evt, input);
    };

    if (state < STATE_ENDED) {
      em(this.options.event + stateStr(state));
    }

    em(this.options.event);

    if (input.additionalEvent) {
      em(input.additionalEvent);
    }

    if (state >= STATE_ENDED) {
      em(this.options.event + stateStr(state));
    }
  }

  tryEmit(input) {
    if (this.canEmit()) {
      return this.emit(input);
    }
    this.state = STATE_FAILED;
  }

  canEmit() {
    let i = 0;
    while (i < this.requireFail.length) {
      if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
        return false;
      }
      i++;
    }
    return true;
  }

  recognize(inputData) {
    let inputDataClone = assign({}, inputData);

    if (!valOrFunc(this.options.enable, [this, inputDataClone])) {
      this.reset();
      this.state = STATE_FAILED;
      return;
    }

    if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
      this.state = STATE_POSSIBLE;
    }

    this.state = this.process(inputDataClone);

    if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
      this.tryEmit(inputDataClone);
    }
  }

  process(inputData) { }

  getTouchAction() {}

  reset() {}
}

Recognizer.prototype.defaults = {};
