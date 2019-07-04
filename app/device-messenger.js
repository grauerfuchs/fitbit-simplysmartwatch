
import { me } from "appbit";
import { me as device } from "device";
import * as messaging from "messaging";

let onmessagereceived;

export function initialize(callback) {
  onmessagereceived = callback;
}

// Received message containing settings data
messaging.peerSocket.addEventListener("message", function(evt) {
  onmessagereceived(evt.data);
});
