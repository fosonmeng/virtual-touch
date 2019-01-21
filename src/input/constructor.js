import inputHandler from './handler';
import valOrFunc from '../utils/val-or-func.js';
import addEventListeners from '../utils/add-event-listeners.js';
import removeEventListeners from '../utils/remove-event-listeners.js';

import {
  inputstart,
  inputmove,
  inputend,
  inputcancel,
  INPUT_START,
  INPUT_MOVE,
  INPUT_END,
  INPUT_CANCEL
} from './consts';
import toArray from '../utils/to-array';
import uniqueArray from '../utils/unique-array.js';
import keys from '../utils/keys';

const TOUCH_INPUT_MAP = {
  [inputstart]: INPUT_START,
  [inputmove]: INPUT_MOVE,
  [inputend]: INPUT_END,
  [inputcancel]: INPUT_CANCEL
};

export default class Input {
  constructor(manager) {
    this.manager = manager;
    this.element = manager.element;

    this.touchTargetEvents = keys(TOUCH_INPUT_MAP).join(' ');
    this.targetIds = {};

    this.handler = this.handler.bind(this);
    this.init();
  }

  handler(ve) { // virtual event
    const { manager } = this;
    if (valOrFunc(manager.options.enable, [manager])) {
      let type = TOUCH_INPUT_MAP[ve.type];
      let touches = this.getTouches(ve, type);
      if (!touches) {
        return;
      }

      inputHandler(this.manager, type, {
        pointers: touches[0],
        changedPointers: touches[1],
        srcEvent:ve
      });
    }
  }

  init() {
    addEventListeners(this.element, this.touchTargetEvents, this.handler);
  }

  destroy() {
    removeEventListeners(this.element, this.touchTargetEvents, this.handler);
  }

  /**
   * @param {VirtualEvent} ve
   * @param {int} type
   */
  getTouches(ve, type) {
    let { targetIds } = this;
    let allTouches = toArray(ve.touches);

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
      targetIds[allTouches[0].identifier] = true;
      return [allTouches, allTouches];
    }

    let i;
    let targetTouches = toArray(ve.targetTouches);
    let changedTouches = toArray(ve.changedTouches);
    let changedTargetTouches = [];

    // collect touches
    if (type === INPUT_START) {
      i = 0;
      while (i < targetTouches.length) {
        targetIds[targetTouches[i].identifier] = true;
        i++;
      }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
      if (targetIds[changedTouches[i].identifier]) {
        changedTargetTouches.push(changedTouches[i]);
      }

      // cleanup removed touches
      if (type & (INPUT_END | INPUT_CANCEL)) {
        delete targetIds[changedTouches[i].identifier];
      }
      i++;
    }

    if (!changedTargetTouches.length) {
      return;
    }

    return [
      // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
      uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
      changedTargetTouches
    ];
  }
}
