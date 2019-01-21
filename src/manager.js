import defaults from './defaults';
import TouchAction from './touchaction/constructor';
import Input from './input/constructor';
import Recognizer from './recognizer/constructor';
import {
  STATE_BEGAN,
  STATE_ENDED,
  STATE_CHANGED,
  STATE_RECOGNIZED
} from './recognizer/consts';

import each from './utils/each';
import assign from './utils/assign';
import splitStr from './utils/split-str';
import invokeArrayArg from './utils/invoke-array-arg.js';

const STOP = 1;
const FORCED_STOP = 2;

export default class Manager {
  constructor(virtual, options) {
    this.options = assign({}, defaults, options || {});

    this.handlers = {};
    this.session = {};
    this.recognizers = [];

    this.element = virtual;
    this.input = new Input(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    each(this.options.recognizers, (item) => {
      let recognizer = this.add(new (item[0])(item[1]));
      item[2] && recognizer.recognizeWith(item[2]);
      item[3] && recognizer.requireFailure(item[3]);
    });
  }

  set(options) {
    assign(this.options, options);

    if (options.touchAction) {
      this.touchAction.update();
    }

    if (options.inputTarget) {
      this.input.destroy();
      this.input.target = options.inputTarget;
      this.input.init();
    }
    return this;
  }

  stop(force) {
    this.session.stopped = force ? FORCED_STOP : STOP;
  }

  recognize(inputData) {
    let { session } = this;
    if (session.stopped) {
      return;
    }

    this.touchAction.preventDefaults(inputData);

    let recognizer;
    let { recognizers } = this;

    let { curRecognizer } = session;

    if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
      curRecognizer = session.curRecognizer = null;
    }

    each(recognizers, (recognizer) => {
      if (session.stopped !== FORCED_STOP && (
          !curRecognizer || recognizer === curRecognizer ||
          recognizer.canRecognizeWith(curRecognizer))) {
        recognizer.recognize(inputData);
      } else {
        recognizer.reset();
      }

      if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
        curRecognizer = session.curRecognizer = recognizer;
      }
    }, this);
  }

  get(recognizer) {
    if (recognizer instanceof Recognizer) {
      return recognizer;
    }

    let { recognizers } = this;
    for (let i = 0; i < recognizers.length; i++) {
      if (recognizers[i].options.event === recognizer) {
        return recognizers[i];
      }
    }
    return null;
  }

  add(recognizer) {
    if (invokeArrayArg(recognizer, 'add', this)) {
      return this;
    }

    let existing = this.get(recognizer.options.event);
    if (existing) {
      this.remove(existing);
    }

    this.recognizers.push(recognizer);
    recognizer.manager = this;

    this.touchAction.update();
    return recognizer;
  }

  remove(recognizer) {
    if (invokeArrayArg(recognizer, 'remove', this)) {
      return this;
    }

    recognizer = this.get(recognizer);

    if (recognizer) {
      let { recognizers } = this;
      let index = inArray(recognizers, recognizer);

      if (index > -1) {
        recognizers.splice(index, 1);
        this.touchAction.update();
      }
    }

    return this;
  }

  on(events, handler) {
    if (!events || !handler) {
      return;
    }

    let { handlers } = this;
    each(splitStr(events), (event) => {
      handlers[event] = handlers[event] || [];
      handlers[event].push(handler);
    });
    return this;
  }

  off(events, handler) {
    if (events === undefined) {
      return;
    }

    let { handlers } = this;
    each(splitStr(events), (event) => {
      if (!handler) {
        delete handlers[event];
      } else {
        if (handlers[event]) {
          const index = inArray(handlers[event], handler);
          if (index > -1) {
            handlers[event].splice(index, 1);
          }
        }
      }
    });
    return this;
  }

  emit(event, data) {
    let handlers = this.handlers[event] && this.handlers[event].slice();
    if (!handlers || !handlers.length) {
      return;
    }

    data.type = event;

    each(handlers, (handler) => {
      handler(data);
    });
  }

  destroy() {
    this.handlers = {};
    this.session = {};
    this.input.destroy();
    this.element = null;
  }
}
