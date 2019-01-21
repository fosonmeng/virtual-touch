export default function inArray(src, find, findByKey) {
  if (src.indexOf && !findByKey) {
    return src.indexOf(find);
  } else {
    let i = 0;
    while (i < src.length) {
      if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {// do not use === here, test fails
        return i;
      }
      i++;
    }
    return -1;
  }
}
