
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'fs';

const rootDir = './src/db/temp'


const JSONToFile = (obj, dir, fileName) => {
    const fileDir = `${rootDir}/${dir}`;
    const filePath = `${fileDir}/${fileName}`;
    if(!existsSync(fileDir)) {
        console.log('Creating Directory: ', fileDir);
        mkdirSync(fileDir, {recursive: true}); 
    }

    console.log(`Creating ${filePath}.`);
    writeFileSync(`${filePath}`, JSON.stringify(obj, null, 2));
};
const readJsonFile = (dir, fileName) => {
    const filePath = `${rootDir}/${dir}/${fileName}`
    if(!existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return 'ERRONET';
    }

    console.log(`Reading ${filePath} file.`);
    return JSON.parse(readFileSync(`${filePath}`));
};

export {JSONToFile, readJsonFile};