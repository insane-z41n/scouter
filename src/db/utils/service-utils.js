import axios from 'axios'
import { JSONToFile, readJsonFile } from './json-utils.js';

const getInfo = async (fileDir, fileName, url) => {
    let data = readJsonFile(fileDir, fileName);
    if(data==='ERRONET') {
        console.log("Calling url: ", url);
        const res = await axios.get(url);
        JSONToFile(res.data, fileDir, fileName);
        data = readJsonFile(fileDir, fileName);
    }
    return data;
}

export {getInfo};