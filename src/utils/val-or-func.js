export default function val(value, args) {
  if (typeof value === 'function') {
    return value.apply(args ? args[0] || undefined : undefined, args);
  }
  return value;
}
