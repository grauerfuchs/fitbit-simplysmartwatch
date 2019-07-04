export function zeroPad(i, l) {
  i = "" + i;
  while (i.length < l)
    i = "0" + i;
  if (i.length > l)
    i = i.substring(i.length - l);
  return i;
}
