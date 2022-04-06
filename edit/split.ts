import Jimp from 'jimp';
import {XMLParser} from 'fast-xml-parser';
import fs from 'fs';
import { PKM, PKM_TINT, PKM_ANIM, PKM_ACTION } from '../app/models/enum';
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
                const shiny = zeroPaddedValue == pad ? PKM_TINT.NORMAL : PKM_TINT.SHINY;
                const creditFile = fs.readFileSync(`${path}/sprite/${pad}/credits.txt`);
                const splitted = creditFile.toString().split('\t');
                credits[`${zeroPaddedValue}-${shiny}`] = {date:'', author: ''};
                credits[`${zeroPaddedValue}-${shiny}`]['date'] = splitted[0];
                credits[`${zeroPaddedValue}-${shiny}`]['author'] = splitted[1].split(`\n`)[0];
                console.log('add', creditFile, 'to the credits for', mapName.get(index));
                
                const xmlFile = fs.readFileSync(`${path}/sprite/${pad}/AnimData.xml`);
                const parser = new XMLParser();
                const xmlData = <IPMDCollab> parser.parse(xmlFile);
                await Promise.all(Object.values(PKM_ANIM).map(async anim => {
                    await Promise.all(Object.values(PKM_ACTION).map(async action => {
                        try{
                            const img = await Jimp.read(`${path}/sprite/${pad}/${action}-${anim}.png`);
                            const metadata = xmlData.AnimData.Anims.Anim.find(m=>m.Name==action);
                            durations[`${zeroPaddedValue}/${shiny}/${action}/${anim}`] = [...metadata.Durations.Duration];
                            // console.log(durations);
                            const frameHeight = metadata.FrameHeight;
                            const frameWidth = metadata.FrameWidth;
                            const width = img.getWidth() / frameWidth;
                            const height = img.getHeight() / frameHeight;
                            // console.log('img', zeroPaddedValue, 'action', action, 'frame height', metadata.FrameHeight, 'frame width', metadata.FrameWidth, 'width', img.getWidth(), 'height', img.getHeight(), ':', width, height);
                            for (let x = 0; x < width; x++) {
                                for (let y = 0; y < height; y++) {
                                    const cropImg = img.clone();
                                
                                    if(anim == PKM_ANIM.SHADOW){
                                        const shadow = xmlData.AnimData.ShadowSize;
                                        if(shadow == 0){
                                            removeRed(cropImg);
                                            removeBlue(cropImg);
                                        }
                                        else if(shadow == 1){
                                            removeBlue(cropImg);
                                        }
                                        // transform to black
                                        cropImg.scan(0,0,cropImg.bitmap.width,cropImg.bitmap.height, (x,y,idx)=> {
                                            if (cropImg.bitmap.data[idx + 3] != 0) {
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
                                    
                                    const writePath = `split/${zeroPaddedValue}/${shiny}/${action}/${anim}/${y}/${zeroPad(x)}.png`;
                                    console.log(writePath);
                                    await cropImg.writeAsync(writePath);
                                }
                            }
                        }
                        catch(error){
                            console.log('action', action, 'is missing for index', index, mapName.get(index));
                        }
                    }));
                }));
            }
            catch(error){
                console.log('pokemon with index', index, 'not found', mapName.get(index));
            }
        }));
    }));

    const file = fs.createWriteStream(`sheets/credits.json`);
    file.on('error', function(err) {
      console.log(err);
    });
    file.write(JSON.stringify(credits));
    file.end();

    const fileA = fs.createWriteStream(`sheets/durations.json`);
    fileA.on('error', function(err) {
      console.log(err);
    });
    fileA.write(JSON.stringify(durations));
    fileA.end();
}

function removeBlue(cropImg){
    cropImg.scan(0,0,cropImg.bitmap.width,cropImg.bitmap.height, (x,y,idx)=> {
        if (cropImg.bitmap.data[idx] == 0 
            && cropImg.bitmap.data[idx + 1] == 0
            && cropImg.bitmap.data[idx + 2] != 0) {
            cropImg.bitmap.data[idx] = 0;
            cropImg.bitmap.data[idx + 1] = 0;
            cropImg.bitmap.data[idx + 2] = 0;
            cropImg.bitmap.data[idx + 3] = 0;
        }
    });
}

function removeRed(cropImg){
    cropImg.scan(0,0,cropImg.bitmap.width,cropImg.bitmap.height, (x,y,idx)=> {
        if (cropImg.bitmap.data[idx] != 0 
            && cropImg.bitmap.data[idx + 1] == 0
            && cropImg.bitmap.data[idx + 2] == 0) {
            cropImg.bitmap.data[idx] = 0;
            cropImg.bitmap.data[idx + 1] = 0;
            cropImg.bitmap.data[idx + 2] = 0;
            cropImg.bitmap.data[idx + 3] = 0;
        }
    });
}

function zeroPad(num: number) {
    return ('0000'+num).slice(-4);
}


split();