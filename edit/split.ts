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
}

async function split(){
    const pkmaIndexes = [];
    const mapName = new Map<number, string>();

    Object.values(PKM).forEach(pkm => {
        const pokemon = PokemonFactory.createPokemonFromName(pkm);
        if(!pkmaIndexes.includes(pokemon.index)){
            pkmaIndexes.push(pokemon.index);
            mapName.set(pokemon.index, pokemon.name);
        }
    });

    pkmaIndexes.forEach(index =>{
        const zeroPaddedValue = zeroPad(index);
        try{
            const xmlFile = fs.readFileSync(`${path}/sprite/${zeroPaddedValue}/AnimData.xml`);
            const parser = new XMLParser();
            const xmlData = <IPMDCollab> parser.parse(xmlFile);
            ['Attack', 'Walk', 'Sleep'].forEach(async mode => {
                try{
                    const img = await Jimp.read(`${path}/sprite/${zeroPaddedValue}/${mode}-Anim.png`);
                    const metadata = xmlData.AnimData.Anims.Anim.find(m=>m.Name==mode);
                    const frameHeight = metadata.FrameHeight;
                    const frameWidth = metadata.FrameWidth;
                    const width = img.getWidth() / frameWidth;
                    const height = img.getHeight() / frameHeight;
                    // console.log('img', zeroPaddedValue, 'mode', mode, 'frame height', metadata.FrameHeight, 'frame width', metadata.FrameWidth, 'width', img.getWidth(), 'height', img.getHeight(), ':', width, height);
                    let i = 0;
                    for (let x = 0; x < width; x++) {
                       for (let y = 0; y < height; y++) {
                            const cropImg = img.clone();
                            cropImg.crop(
                                x * frameWidth,
                                y * frameHeight,
                                frameWidth,
                                frameHeight);
                            await cropImg.writeAsync(`split/${zeroPaddedValue}/${mode}/${zeroPaddedValue}-${mode}-${zeroPad(i)}.png`);
                            i++;
                       }
                    }
                }
                catch(error){
                    console.log('mode', mode, 'is missing for index', index, mapName.get(index));
                }

    
            });
        }
        catch(error){
            console.log('pokemon with index', index, 'not found', mapName.get(index));
        }
    });
}

function zeroPad(num: number) {
    return ('0000'+num).slice(-4);
}


split();