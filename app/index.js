import {battery} from "power";
import {clock} from "clock";
import {display} from "display";
import {preferences} from "user-settings";
import document from "document";
import * as dateandtime from "../common/dateandtime";
import * as fs from "fs";
import * as css from "../common/cssify";
import * as util from "../common/utils";
import * as settings from "./device-settings";
import * as messenger from "./device-messenger";
import * as jpeg from "jpeg";
import { inbox } from "file-transfer";

let displayObjects = {
  background : document.getElementById("imgBackground"),
  battery : {
    bar : document.getElementById("myBattBar"),
    image : document.getElementById("imgBatt"),
    text : document.getElementById("myBattPct"),
  },
  clock : {
    date: document.getElementById("myDate"),
    HM: document.getElementById("myTimeHM"),
    sec: document.getElementById("myTimeSec"),
    AMPM: document.getElementById("myTimeAMPM"),
    UTC: document.getElementById("myUTCTime")
  }
};


function messageReceived(data) {
  switch (data.event) {
    case "settingchanged":
      settings.set(data.key, data.value);
      break;
    default:
      console.log("Unknown Message received: " + data.event);
      break;
  }
}
messenger.initialize(messageReceived);

function applySettings() {
  displayObjects.background.style.visibility = css.visibility(settings.getBoolean("ShowBg", false));
  displayObjects.background.style.opacity = settings.getFloat("bgOpacity", 1);
  displayObjects.background.href = settings.getString("bgImage", "");

  var fgFill = settings.getString("fgColor", "white");
  displayObjects.clock.UTC.style.fill = fgFill;
  displayObjects.clock.date.style.fill = fgFill;
  displayObjects.clock.HM.style.fill = fgFill;
  displayObjects.clock.sec.style.fill = fgFill;
  displayObjects.battery.text.style.fill = fgFill;

  var ShowBattBar = settings.getBoolean("ShowBattBar", true);
  displayObjects.battery.bar.style.visibility = css.visibility(ShowBattBar);
  displayObjects.battery.image.style.visibility = css.visibility(ShowBattBar);
  displayObjects.battery.text.style.visibility = css.visibility(
    ShowBattBar && settings.getBoolean("ShowBattPct", false)
  );
  
  displayObjects.clock.UTC.style.visibility = css.visibility(settings.getBoolean("ShowUTC", false));
  
}
settings.listen(applySettings);
settings.load();

function renderBattery(){
  displayObjects.battery.text.text = battery.chargeLevel + "%";
  displayObjects.battery.bar.width = Math.ceil(23 * (battery.chargeLevel / 100));
  if (battery.chargeLevel < 20)
    displayObjects.battery.bar.style.fill = "#A00000";
  else if (battery.chargeLevel < 67)
    displayObjects.battery.bar.style.fill = "#A0A000";
  else
    displayObjects.battery.bar.style.fill = "#00A000";
}

battery.onchange = (evt) => {
  if (display.on) renderBattery();
}
renderBattery(); // Must force refresh on start

var dtLastTick = null;
function renderWatchFace(time){
  if (dtLastTick == null || time.getDate() != dtLastTick.getDate()){
    displayObjects.clock.date.text = dateandtime.getDateString(time);
  }
  if (dtLastTick == null || time.getMinutes() != dtLastTick.getMinutes()) {
    displayObjects.clock.UTC.text = dateandtime.getUTCTimeString(time);
    var is24h = !(preferences.clockDisplay === "12h");
    displayObjects.clock.HM.text = dateandtime.getTimeString(time, is24h);
    displayObjects.clock.AMPM.text = (is24h) ? "" : dateandtime.getAMPM(time); 
  }
  displayObjects.clock.sec.text = util.zeroPad(time.getSeconds(), 2);
  dtLastTick = time;
}
function clearWatchFace(){
  dtLastTick = null; // Because the clock is cleared, mark as not ticked.
  displayObjects.clock.UTC.text = "";
  displayObjects.clock.date.text = "";
  displayObjects.clock.HM.text = "";
  displayObjects.clock.AMPM.text = ""; 
  displayObjects.clock.sec.text = "";
}
clock.ontick = (evt) => { 
  if (display.on) renderWatchFace(evt.date);
};
function setClockTick(){
  if (!display.on)
    clock.graularity = "off";
  else if (settings.getBoolean("ShowSeconds", true))
    clock.granularity = "seconds";
  else
    clock.granularity = "minutes";
}
// Start the clock if the screen is on
setClockTick();

display.onchange = (evt) => {
  var c = (clock.granularity != "off"); // Is the clock running?
  var d = display.on; // Is the display on?
  if (d && !c) {
    renderWatchFace(new Date()); // Force immediate render
    // Resume the ticking
    setClockTick();
    renderBattery();
  } else if (!d && c) {
    clock.granularity = "off"; // Big power save to disable when screen is off
    displayObjects.battery.text.text = "";
    clearWatchFace();
  }
};

inbox.onnewfile = () => {
  let fileName;
  do {
    fileName = inbox.nextFile();
    if (fileName === "bgimage.jpg") {
      console.log("New background image received.");
      if (settings.getString("bgImage", "") !== "") {
        fs.unlinkSync(settings.get("bgImage"));
        settings.set("bgImage", "");
      }
      let outFileName = "bgimage-" + (Math.floor(Math.random() * Math.floor(100000))) + ".txi";
      jpeg.decodeSync(fileName, outFileName, {delete:true, overwrite:true});
      settings.set("bgImage", `/private/data/${outFileName}`);
      console.log("New background image set.");
    }
  } while (fileName);
};
