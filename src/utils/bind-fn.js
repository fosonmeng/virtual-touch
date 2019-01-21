export default function bindFn(fn, context) {
  return function boundFn() {
    return fn.apply(context, arguments);
  };
}
