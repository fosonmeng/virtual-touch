import each from './each';
import splitStr from './split-str';

export default function removeEventListeners(target, types, handler) {
  each(splitStr(types), (type) => {
    target.removeEventListener(type, handler, false);
  });
}
