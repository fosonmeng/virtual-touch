const COMPUTE_INTERVAL = 25;

const inputstart = 'inputstart';
const inputmove = 'inputmove';
const inputend = 'inputend';
const inputcancel = 'inputcancel';
const INPUT_START = 1;
const INPUT_MOVE = 2;
const INPUT_END = 4;
const INPUT_CANCEL = 8;

const DIRECTION_NONE = 1;
const DIRECTION_LEFT = 2;
const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 8;
const DIRECTION_DOWN = 16;

const DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
const DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
const DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

const PROPS_XY = ['x', 'y'];
const PROPS_CLIENT_XY = ['clientX', 'clientY'];

export {
  COMPUTE_INTERVAL,
  inputstart,
  inputmove,
  inputend,
  inputcancel,
  INPUT_START,
  INPUT_MOVE,
  INPUT_END,
  INPUT_CANCEL,
  DIRECTION_NONE,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  DIRECTION_UP,
  DIRECTION_DOWN,
  DIRECTION_HORIZONTAL,
  DIRECTION_VERTICAL,
  DIRECTION_ALL,
  PROPS_XY,
  PROPS_CLIENT_XY
}
