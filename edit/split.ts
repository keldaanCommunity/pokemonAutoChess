import Jimp from 'jimp';
import {XMLParser} from 'fast-xml-parser';
import fs from 'fs';
import { PKM } from '../app/models/enum';
import PokemonFactory from '../app/models/pokemon-factory';

const args = process.argv.slice(2);
const path = args[0];

interface IPMDCollab {
    AnimData: IAnimData
}

interface IAnimData {
    ShadowSize: number
    Anims: {
        Anim: IAnim[]
    }
}

interface IAnim {
    Name: string
    Index: number
    FrameWidth: number
    FrameHeight: number
    Durations: IDuration
}

interface IDuration{
    Duration: any[]
}

async function split(){
    const pkmaIndexes = [];
    const mapName = new Map<number, string>();
    const credits = {};
    const durations = {};

    Object.values(PKM).forEach(pkm => {
        const pokemon = PokemonFactory.createPokemonFromName(pkm);
        if(!pkmaIndexes.includes(pokemon.index)){
            pkmaIndexes.push(pokemon.index);
            mapName.set(pokemon.index, pokemon.name);
        }
    });

    await Promise.all(pkmaIndexes.map(async index =>{
        const zeroPaddedValue = zeroPad(index);
        await Promise.all([zeroPaddedValue, `${zeroPaddedValue}/0000/0001`].map(async pad => {
            try{
                const shiny = zeroPaddedValue == pad ? 'Normal' : 'Shiny';
                const creditFile = fs.readFileSync(`${path}/sprite/${pad}/credits.txt`);
                const splitted = creditFile.toString().split('\t');
                credits[`${zeroPaddedValue}-${shiny}`] = {date:'', author: ''};
                credits[`${zeroPaddedValue}-${shiny}`]['date'] = splitted[0];
                credits[`${zeroPaddedValue}-${shiny}`]['author'] = splitted[1].split(`\n`)[0];
                console.log('add', creditFile, 'to the credits for', mapName.get(index));
                
                const xmlFile = fs.readFileSync(`${path}/sprite/${pad}/AnimData.xml`);
                const parser = new XMLParser();
                const xmlData = <IPMDCollab> parser.parse(xmlFile);
                await Promise.all(['Anim', 'Shadow'].map(async anim => {
                    await Promise.all(['Attack', 'Walk', 'Sleep'].map(async mode => {
                        try{
                            const img = await Jimp.read(`${path}/sprite/${pad}/${mode}-${anim}.png`);
                            const metadata = xmlData.AnimData.Anims.Anim.find(m=>m.Name==mode);
                            durations[`${zeroPaddedValue}/${shiny}/${mode}/${anim}`] = [...metadata.Durations.Duration];
                            // console.log(durations);
                            const frameHeight = metadata.FrameHeight;
                            const frameWidth = metadata.FrameWidth;
                            const width = img.getWidth() / frameWidth;
                            const height = img.getHeight() / frameHeight;
                            // console.log('img', zeroPaddedValue, 'mode', mode, 'frame height', metadata.FrameHeight, 'frame width', metadata.FrameWidth, 'width', img.getWidth(), 'height', img.getHeight(), ':', width, height);
                            for (let x = 0; x < width; x++) {
                                for (let y = 0; y < height; y++) {
                                    const cropImg = img.clone();
                                
                                    if(anim == 'Shadow'){
                                        const shadow = xmlData.AnimData.ShadowSize;
                                        cropImg.scan(0,0,cropImg.bitmap.width,cropImg.bitmap.height, (x,y,idx)=> {
                                            if (cropImg.bitmap.data[idx] != 0 && cropImg.bitmap.data[idx + 1] != 0 && cropImg.bitmap.data[idx + 2] != 0) {
                                                cropImg.bitmap.data[idx] = 0;
                                                cropImg.bitmap.data[idx + 1] = 0;
                                                cropImg.bitmap.data[idx + 2] = 0;
                                            }
                                        });
                                        if(shadow == 1){
                                            cropImg.scan(0,0,cropImg.bitmap.width,cropImg.bitmap.height, (x,y,idx)=> {
                                                if (cropImg.bitmap.data[idx] != 0 || cropImg.bitmap.data[idx + 2] != 0) {
                                                    cropImg.bitmap.data[idx] = 0;
                                                    cropImg.bitmap.data[idx + 2] = 0;
                                                    cropImg.bitmap.data[idx + 3] = 0; 
                                                }
                                            });
                                        }
                                        else if(shadow == 2){
                                            cropImg.scan(0,0,cropImg.bitmap.width,cropImg.bitmap.height, (x,y,idx)=> {
                                                if (cropImg.bitmap.data[idx + 2]) {
                                                    cropImg.bitmap.data[idx + 2] = 0;
                                                }
                                            });
                                        }
                                        cropImg.scan(0,0,cropImg.bitmap.width,cropImg.bitmap.height, (x,y,idx)=> {
                                            if (cropImg.bitmap.data[idx + 2]) {
                                                cropImg.bitmap.data[idx + 2] = 0;
                                            }
                                            if (cropImg.bitmap.data[idx + 3] != 0){
                                                cropImg.bitmap.data[idx] = 0;
                                                cropImg.bitmap.data[idx + 1] = 0;
                                                cropImg.bitmap.data[idx + 2] = 0;
                                            }
                                        });
                                    }
                                    
                                    cropImg.crop(
                                        x * frameWidth,
                                        y * frameHeight,
                                        frameWidth,
                                        frameHeight);
                                    
                                    const writePath = `split/${zeroPaddedValue}/${shiny}/${mode}/${anim}/${zeroPad(y*x + x)}.png`;
                                    console.log(writePath);
                                    await cropImg.writeAsync(writePath);
                                }
                            }
                        }
                        catch(error){
                            console.log('mode', mode, 'is missing for index', index, mapName.get(index));
                        }
                    }));
                }));
            }
            catch(error){
                console.log('pokemon with index', index, 'not found', mapName.get(index));
            }
        }));
    }));

    const file = fs.createWriteStream(`credits.json`);
    file.on('error', function(err) {
      console.log(err);
    });
    file.write(JSON.stringify(credits));
    file.end();

    const fileA = fs.createWriteStream(`durations.json`);
    fileA.on('error', function(err) {
      console.log(err);
    });
    fileA.write(JSON.stringify(durations));
    fileA.end();
}

function zeroPad(num: number) {
    return ('0000'+num).slice(-4);
}


split();