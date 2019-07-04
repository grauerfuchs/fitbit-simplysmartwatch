import { settingsStorage } from "settings";
import { device } from "peer";
import {Image} from "image";
import * as messenger from "./companion-messenger";
import { outbox } from "file-transfer";
import * as colorific from "../common/colorific";

function transferBGImage(settingsValue) {
  const imageData = JSON.parse(settingsValue);
  Image.from(imageData.imageUri)
    .then(image =>
      image.export("image/jpeg", {
        background: "#000000",
        quality: 40
      })
    )
    .then(buffer => outbox.enqueue("bgimage.jpg", buffer))
    .then(fileTransfer => {
      console.log(`Enqueued ${fileTransfer.name}`);
    });
}

settingsStorage.addEventListener("change", evt => {
  if (evt.oldValue !== evt.newValue) {
    switch (evt.key) {
      case "bgImage":
        transferBGImage(evt.newValue);
        break;
      case "fgColorR":
      case "fgColorG":
      case "fgColorB":
        var col = colorific.RGBToHtml(
          settingsStorage.getItem("fgColorR"),
          settingsStorage.getItem("fgColorG"),
          settingsStorage.getItem("fgColorB")
        );
        settingsStorage.setItem("fgColor", col);
        messenger.send(
          "settingchanged",
          "fgColor",
          col
        );
        console.log("Changing foreground color: " + col);
        break;
      default:
        messenger.send("settingchanged", evt.key, evt.newValue);
        console.log("companion: Setting changed: " + evt.key + "=" + evt.newValue);
        break;
    }
  }
});
settingsStorage.setItem("screenWidth", device.screen.width);
settingsStorage.setItem("screenHeight", device.screen.height);

function setDefaultSetting(key, value) {
  let extantValue = settingsStorage.getItem(key);
  if (extantValue === null) settingsStorage.setItem(key, JSON.stringify(value));
}
function presetDefaults(){
  setDefaultSetting("fgColor", "#FFFFFF");
  setDefaultSetting("fgColorR", 255);
  setDefaultSetting("fgColorG", 255);
  setDefaultSetting("fgColorB", 255);
  setDefaultSetting("ShowUTC", false);
  setDefaultSetting("ShowSeconds", true);
  setDefaultSetting("ShowBattBar", true);
  setDefaultSetting("ShowBattPct", false);
  setDefaultSetting("bgOpacity", 1);  
}
presetDefaults();
