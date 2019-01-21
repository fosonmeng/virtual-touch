import {
  inputstart,
  inputmove,
  inputend,
  inputcancel
} from './input/consts';
import inArray from './utils/in-array.js';
import each from './utils/each';
import assign from './utils/assign';
import VirtualEvent from './virtual-event';

export default class Virtual {
  constructor(options) {
    if (!options) {
      options = {};
    }
    this.eventAdaptor = options.eventAdaptor;
    this.eventListeners = {};
  }

  addEventListener(input, handler, useCapture) {
    if (input in this.eventListeners) {
      const index = inArray(this.eventListeners[input], handler);
      if (index < 0) {
        this.eventListeners[input].push(handler);
      }
    } else {
      this.eventListeners[input] = [handler];
    }
  }

  removeEventListener(input, handler, useCapture) {
    if (input in this.eventListeners) {
      const index = inArray(this.eventListeners[input], handler);
      if (index > -1) {
        this.eventListeners[input].splice(index, 1);
      }
    }
  }
}

assign(Virtual.prototype, {
  [inputstart](e) {
    const ve = new VirtualEvent(e, this.eventAdaptor);
    if (inputstart in this.eventListeners) {
      each(this.eventListeners[inputstart], function(handler) {
        handler(ve);
      }, this);
    }
  },
  [inputmove](e) {
    const ve = new VirtualEvent(e, this.eventAdaptor);
    if (inputmove in this.eventListeners) {
      each(this.eventListeners[inputmove], function(handler) {
        handler(ve);
      }, this);
    }
  },
  [inputend](e) {
    const ve = new VirtualEvent(e, this.eventAdaptor);
    if (inputend in this.eventListeners) {
      each(this.eventListeners[inputend], function(handler) {
        handler(ve);
      }, this);
    }
  },
  [inputcancel](e) {
    const ve = new VirtualEvent(e, this.eventAdaptor);
    if (inputcancel in this.eventListeners) {
      each(this.eventListeners[inputcancel], function(handler) {
        handler(ve);
      }, this);
    }
  }
});
