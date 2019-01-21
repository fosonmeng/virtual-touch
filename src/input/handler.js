import {
  INPUT_START,
  INPUT_MOVE,
  INPUT_END,
  INPUT_CANCEL
} from './consts';
import computeInputData from './compute-input-data.js';

export default function inputHandler(manager, eventType, input) {
  let pointersLen = input.pointers.length;
  let changedPointersLen = input.changedPointers.length;
  let isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
  let isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

  input.isFirst = !!isFirst;
  input.isFinal = !!isFinal;

  if (isFirst) {
    manager.session = {};
  }

  input.eventType = eventType;

  computeInputData(manager, input);

  manager.emit('virtual.input', input);

  manager.recognize(input);
  manager.session.prevInput = input;
}
