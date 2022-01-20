import editJsonFile from 'edit-json-file'
import { DIRNAME } from '../data/dirname.js'
//get the _absolute_ **absolute** path of data.json file
const directory = __dirname.split`/`.splice(0, __dirname.split`/`.length-4).join`/` + '/data/data.json'
const data = editJsonFile(DIRNAME.split`/`.splice(0, DIRNAME.split`/`.length-2) + "/data/data.json" || process.env.JSON_PATH || directory)

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
