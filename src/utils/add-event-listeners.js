import each from './each';
import splitStr from './split-str';

export default function addEventListeners(target, types, handler) {
  each(splitStr(types), (type) => {
    target.addEventListener(type, handler, false);
  });
}
