export default function keys(obj) {
  let ret = [];
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      ret.push(k);
    }
  }
  return ret;
}
