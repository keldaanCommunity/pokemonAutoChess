import Jimp from 'jimp';
import {XMLParser} from 'fast-xml-parser';
import fs from 'fs';
import {Pkm} from '../app/types/enum/Pokemon';
import PokemonFactory from '../app/models/pokemon-factory';
import { PokemonActionState, PokemonTint, SpriteType } from '../app/types/enum/Game';

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
    CopyOf: string
}

interface IDuration{
    Duration: any
}

async function split(){

    const pkmaIndexes = ["0000"];
    const mapName = new Map<string, string>();
    // const credits = {};
    const durations = {};
    let missing = '';

    Object.values(Pkm).forEach(pkm => {
        const pokemon = PokemonFactory.createPokemonFromName(pkm);
        if(!pkmaIndexes.includes(pokemon.index)){
            pkmaIndexes.push(pokemon.index);
            mapName.set(pokemon.index, pokemon.name);
        }
    });

    await Promise.all(pkmaIndexes.map(async index =>{
        const pathIndex = index.replace('-','/');
        const shinyPad = pathIndex.length == 4 ? `${pathIndex}/0000/0001`:  `${pathIndex}/0001`;
        await Promise.all([pathIndex, shinyPad].map(async pad => {
            try{
                const shiny = pathIndex == pad ? PokemonTint.NORMAL : PokemonTint.SHINY;
                // const creditFile = fs.readFileSync(`${path}/sprite/${pad}/credits.txt`);
                // const splitted = creditFile.toString().split('\t');
                // credits[`${index}_${shiny}`] = {date:'', author: ''};
                // credits[`${index}_${shiny}`]['date'] = splitted[0].slice(0,10);
                // credits[`${index}_${shiny}`]['author'] = splitted[1].split(`\n`)[0].split(`\r`)[0];
                //console.log('add', creditFile, 'to the credits for', mapName.get(index));
                
                const xmlFile = fs.readFileSync(`${path}/sprite/${pad}/AnimData.xml`);
                const parser = new XMLParser();
                const xmlData = <IPMDCollab> parser.parse(xmlFile);
                await Promise.all(Object.values(SpriteType).map(async anim => {
                    await Promise.all(Object.values(PokemonActionState).map(async action => {
                        try{
                            let img;
                            let metadata = xmlData.AnimData.Anims.Anim.find(m=>m.Name==action);

                            if(metadata.CopyOf){
                                img = await Jimp.read(`${path}/sprite/${pad}/${metadata.CopyOf}-${anim}.png`);
                                metadata = xmlData.AnimData.Anims.Anim.find(m=>m.Name==metadata.CopyOf);
                            }
                            else{
                                img = await Jimp.read(`${path}/sprite/${pad}/${action}-${anim}.png`);
                            }


                            durations[`${index}/${shiny}/${action}/${anim}`] = metadata.Durations.Duration.length !== undefined ?[...metadata.Durations.Duration]: [metadata.Durations.Duration];
                            // console.log(durations);
                            const frameHeight = metadata.FrameHeight;
                            const frameWidth = metadata.FrameWidth;
                            const width = img.getWidth() / frameWidth;
                            const height = img.getHeight() / frameHeight;
                            // console.log('img', index, 'action', action, 'frame height', metadata.FrameHeight, 'frame width', metadata.FrameWidth, 'width', img.getWidth(), 'height', img.getHeight(), ':', width, height);
                            for (let x = 0; x < width; x++) {
                                for (let y = 0; y < height; y++) {
                                    const cropImg = img.clone();
                                
                                    if(anim == SpriteType.SHADOW){
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
                                    
                                    const writePath = `split/${index}/${shiny}/${action}/${anim}/${y}/${zeroPad(x)}.png`;
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
                console.log('pokemon with index', index, 'not found', mapName.get(index), 'path: ', `${path}/sprite/${pad}/AnimData.xml`);
                missing += `${mapName.get(index)},${pad}/AnimData.xml\n`;
            }
        }));
    }));

    // const file = fs.createWriteStream(`sheets/credits.json`);
    // file.on('error', function(err) {
    //   console.log(err);
    // });
    // file.write(JSON.stringify(credits));
    // file.end();

    const fileA = fs.createWriteStream(`sheets/durations.json`);
    fileA.on('error', function(err) {
      console.log(err);
    });
    fileA.write(JSON.stringify(durations));
    fileA.end();

    const fileB = fs.createWriteStream(`sheets/missing.txt`);
    fileB.on('error', function(err) {
      console.log(err);
    });
    fileB.write(missing);
    fileB.end();
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