import { now, abs } from '../utils/consts';
import simpleCloneInputData from './simple-clone-input-data.js';
import getAngle from './get-angle';
import getCenter from './get-center';
import getDirection from './get-direction';
import getDistance from './get-distance';
import getRotation from './get-rotation';
import getScale from './get-scale';
import getVelocity from './get-velocity';
import computeDeltaXY from './compute-delta-xy.js';
import computeIntervalInputData from './compute-interval-input-data.js';

export default function computeInputData(manager, input) {
  let { session } = manager;
  let { pointers } = input;
  let { length: pointersLength } = pointers;

  if (!session.firstInput) {
    session.firstInput = simpleCloneInputData(input);
  }

  if (pointersLength > 1 && !session.firstMultiple) {
    session.firstMultiple = simpleCloneInputData(input);
  } else if (pointersLength === 1) {
    session.firstMultiple = false;
  }

  let { firstInput, firstMultiple } = session;
  let offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

  let center = input.center = getCenter(pointers);
  input.timeStamp = now();
  input.deltaTime = input.timeStamp - firstInput.timeStamp;

  input.angle = getAngle(offsetCenter, center, ['x', 'y']);
  input.distance = getDistance(offsetCenter, center, ['x', 'y']);

  computeDeltaXY(session, input);
  input.offsetDirection = getDirection(input.deltaX, input.deltaY);

  let overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
  input.overallVelocityX = overallVelocity.x;
  input.overallVelocityY = overallVelocity.y;
  input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

  input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
  input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

  input.maxPointers = !session.prevInput ? input.pointers.length : Math.max(
      input.pointers.length, session.prevInput.maxPointers)

  computeIntervalInputData(session, input);

  input.target = manager.element;
}
