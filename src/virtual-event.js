import assign from './utils/assign.js';
import {
  inputstart,
  inputmove,
  inputend,
  inputcancel
} from './input/consts';

export default class VirtualEvent {
  constructor(realEvent, eventAdapter) {
    if (!eventAdapter) {
      eventAdapter = this.defaults.eventAdapter;
    }
    assign(this, eventAdapter(realEvent));
  }
}

VirtualEvent.prototype.defaults = {
  eventAdapter(e) {
    const {
      type,
      touches,
      touches: targetTouches,
      changedTouches,
      target,
      preventDefault
    } = e;

    const EVENT_MAP = {
      touchstart: inputstart,
      touchmove: inputmove,
      touchend: inputend,
      touchcancel: inputcancel
    };

    return {
      type: EVENT_MAP[type],
      touches,
      targetTouches,
      changedTouches,
      target,
      preventDefault () {
        preventDefault.call(e);
      },
    };
  },
};
