import bindFn from './bind-fn.js';

export default function setTimeoutContext(fn, timeout, context) {
  return setTimeout(bindFn(fn, context), timeout);
}
