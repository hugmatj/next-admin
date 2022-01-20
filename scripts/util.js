import editJsonFile from 'edit-json-file'
import { DIRNAME } from '../data/dirname.js'
//get the _absolute_ **absolute** path of data.json file
const data = editJsonFile(process.env.JSON_PATH || (DIRNAME + "/data/data.json"))

export function getJSON(){
  return data.get();
}

export function writeJSON(callback){
  let __data = callback(getJSON());
  let keys = Object.keys(__data);
  let values = Object.values(__data);
  for(var i = 0; i < keys.length; i++){
    data.set(keys[i], values[i]);
  }
  data.save();
  return getJSON();
}
