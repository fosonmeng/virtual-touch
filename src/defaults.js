import { TOUCH_ACTION_COMPUTE } from './touchaction/consts';
import { DIRECTION_HORIZONTAL } from './input/consts';
import RotateRecognizer from './recognizer/rotate';
import PinchRecognizer from './recognizer/pinch';
import SwipeRecognizer from './recognizer/swipe';
import PanRecognizer from './recognizer/pan';
import TapRecognizer from './recognizer/tap';
import PressRecognizer from './recognizer/press';

export default {
  touchAction: TOUCH_ACTION_COMPUTE,
  enable: true,
  inputTarget: null,
  preset: [
    // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
    [RotateRecognizer,   { enable: false }],
    [PinchRecognizer,    { enable: false },                   ['rotate']],
    [SwipeRecognizer,    { direction: DIRECTION_HORIZONTAL }],
    [PanRecognizer,      { direction: DIRECTION_HORIZONTAL }, ['swipe']],
    [TapRecognizer],
    [TapRecognizer,      { event: 'doubletap', taps: 2 },     ['tap']],
    [PressRecognizer]
  ],
}
