/*
  Responsible for loading, applying and saving settings.
  Requires companion/simple/companion-settings.js
  Callback should be used to update your UI.
  
  Adapted from Fitbit SDK examples
*/
import { me } from "appbit";
import { me as device } from "device";
import * as fs from "fs";
import * as messaging from "messaging";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";

let settings, onsettingschange;

export function exists(setting){
  if (!settings) loadSettings();
  if (settings[setting]) 
    return true;
  else 
    return false;
}
export function get(setting) {
  if (!settings) loadSettings();
  return settings[setting];
}
export function getBoolean(setting, invalidValue){
  var value = get(setting);
  if (value == null || typeof value === 'undefined') 
    return invalidValue;
  else if (typeof value === 'boolean')
    return value;
  else if (value === "true") 
    return true;
  else if (value === "false") 
    return false;
  else
    return invalidValue;
}
export function getFloat(setting, invalidValue){
  var value = get(setting);
  if (value == null || typeof value === 'undefined') 
    return invalidValue;
  else if (typeof value === 'number') 
    return value;
  value = parseFloat(value);
  if (!isNaN(value)) 
    return value;
  else
    return invalidValue;
}
export function getString(setting, invalidValue){
  var value = get(setting);
  if (value == null || typeof value === 'undefined') 
    return invalidValue;
  if (typeof value === 'string')
    return value;
  else
    return "" + value;
}

export function listen(callback) {
  onsettingschange = callback;
}
export function load()
{
  settings = loadSettings();
  if (onsettingschange) onsettingschange();
}
export function set(setting, value){
  if (!settings) loadSettings();
  settings[setting] = value;
  saveSettings();
  if (onsettingschange) onsettingschange();
}

// Load settings from filesystem
function loadSettings() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    return {};
  }
}

// Save settings to the filesystem
function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}
