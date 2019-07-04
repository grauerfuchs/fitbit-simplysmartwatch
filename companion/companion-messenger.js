import * as messaging from "messaging";

export function sendMessageRaw(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
    return true;
  } else {
    console.log("No peerSocket connection");
    return false;
  }
}     

export function send(event, key, value, retries){
  if (!retries) retries = 3;
  var attempts = 0;
  while (attempts < 3) {
    if (sendMessageRaw({
      event: event,
      key: key,
      value: (value && value !== "") ? value : ""
    }))
      break;
    attempts++;
  }
}