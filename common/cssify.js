export function visibility(boolvalue){
  if (
    boolvalue === true 
    || boolvalue === "true" 
    || boolvalue === "yes"
  )
    return "visible";
  else if (
    boolvalue === false 
    || boolvalue === "false" 
    || boolvalue === "no"
  )
    return "hidden";
  else
    return "undefined";
}