const AMPM = ["AM", "PM"];
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function getDateString(date){
  let year = ("000" + date.getFullYear()).slice(-4);
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  let dow = DOW[date.getDay()];
  return `${dow} ${year}-${month}-${day}`;
}
export function getUTCTimeString(date){
  let hours = ("0" + date.getUTCHours()).slice(-2); 
  let mins = ("0" + date.getUTCMinutes()).slice(-2);
  return `${hours}:${mins}`;
}
export function getAMPM(date){
  return AMPM[date.getHours() >= 12 ? 1 : 0];
}

export function getTimeString(date, is24h){
  let hours = date.getHours();
  if (is24h) 
    hours = ("0" + hours).slice(-2); 
  else 
    hours = (hours % 12 || 12);
  let mins = ("0" + date.getMinutes()).slice(-2);
  return `${hours}:${mins}`;
}

