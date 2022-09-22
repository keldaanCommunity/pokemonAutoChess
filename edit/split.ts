import Jimp from 'jimp'
import {XMLParser} from 'fast-xml-parser'
import fs from 'fs'
import gracefulFs from 'graceful-fs'
import {Pkm} from '../app/types/enum/Pokemon'
import PokemonFactory from '../app/models/pokemon-factory'
import { PokemonActionState, PokemonTint, SpriteType } from '../app/types/enum/Game'

gracefulFs.gracefulify(fs)
const args = process.argv.slice(2)
const path = args[0]

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

    const pkmaIndexes = ['0000']
    const mapName = new Map<string, string>()
    mapName.set('0000','missingno')
    // const credits = {};
    const durations = {}
    let missing = ''

    Object.values(Pkm).forEach(pkm => {
        const pokemon = PokemonFactory.createPokemonFromName(pkm)
        if(!pkmaIndexes.includes(pokemon.index)){
            pkmaIndexes.push(pokemon.index)
            mapName.set(pokemon.index, pokemon.name)
        }
    })

    
    for(let i = 0; i < pkmaIndexes.length; i++){
        const index = pkmaIndexes[i]
        const progression = `${i}/${pkmaIndexes.length -1} (${(i * 100/(pkmaIndexes.length -1)).toFixed(2)}%) #${index} ${mapName.get(index)}`
        const pathIndex = index.replace('-','/')
        const shinyPad = pathIndex.length == 4 ? `${pathIndex}/0000/0001`:  `${pathIndex}/0001`
        const allPads = [pathIndex, shinyPad]

        for (let j = 0; j<allPads.length; j++){
            const pad = allPads[j]
            try{
                const shiny = pathIndex == pad ? PokemonTint.NORMAL : PokemonTint.SHINY
                const xmlFile = fs.readFileSync(`${path}/sprite/${pad}/AnimData.xml`)
                const parser = new XMLParser()
                const xmlData = <IPMDCollab> parser.parse(xmlFile)
                for(let k = 0; k<Object.values(SpriteType).length; k++){
                    const anim = Object.values(SpriteType)[k]
                    for(let l = 0; l<Object.values(PokemonActionState).length; l++){
                        const action = Object.values(PokemonActionState)[l]
                        try{
                            let img
                            let metadata = xmlData.AnimData.Anims.Anim.find(m=>m.Name==action)
                            if(metadata){
                                if(metadata.CopyOf){
                                    img = await Jimp.read(`${path}/sprite/${pad}/${metadata.CopyOf}-${anim}.png`)
                                    metadata = xmlData.AnimData.Anims.Anim.find(m=>m.Name==metadata?.CopyOf)
                                }
                                else{
                                    img = await Jimp.read(`${path}/sprite/${pad}/${action}-${anim}.png`)
                                }
    
                                
                                // eslint-disable-next-line no-unsafe-optional-chaining
                                durations[`${index}/${shiny}/${action}/${anim}`] = metadata?.Durations.Duration.length !== undefined ?[...metadata?.Durations.Duration]: [metadata?.Durations.Duration]
                                const frameHeight = metadata?.FrameHeight
                                const frameWidth = metadata?.FrameWidth

                                if(frameWidth && frameHeight){
                                    const width = img.getWidth() / frameWidth
                                    const height = img.getHeight() / frameHeight
                                // console.log('img', index, 'action', action, 'frame height', metadata.FrameHeight, 'frame width', metadata.FrameWidth, 'width', img.getWidth(), 'height', img.getHeight(), ':', width, height);
                                    for (let x = 0; x < width; x++) {
                                        for (let y = 0; y < height; y++) {
                                            const cropImg = img.clone()
                                        
                                            if(anim == SpriteType.SHADOW){
                                                const shadow = xmlData.AnimData.ShadowSize
                                                if(shadow == 0){
                                                    removeRed(cropImg)
                                                    removeBlue(cropImg)
                                                }
                                                else if(shadow == 1){
                                                    removeBlue(cropImg)
                                                }
                                                // transform to black
                                                cropImg.scan(0,0,cropImg.bitmap.width,cropImg.bitmap.height, (x,y,idx)=> {
                                                    if (cropImg.bitmap.data[idx + 3] != 0) {
                                                        cropImg.bitmap.data[idx] = 0
                                                        cropImg.bitmap.data[idx + 1] = 0
                                                        cropImg.bitmap.data[idx + 2] = 0
                                                    }
                                                })
                                            }
                                            
                                            cropImg.crop(
                                                x * frameWidth,
                                                y * frameHeight,
                                                frameWidth,
                                                frameHeight)
                                            
                                            const writePath = `split/${index}/${shiny}/${action}/${anim}/${y}/${zeroPad(x)}.png`
                                            await cropImg.writeAsync(writePath)
                                        }
                                    }
                                }
                            }

                        }
                        catch(error){
                            console.log(error)
                            console.log('action', action, 'is missing for index', index, mapName.get(index))
                        }
                        console.log(progression, shiny, anim, action)
                    }
                }
            }
            catch(error){
                console.log('pokemon with index', index, 'not found', mapName.get(index), 'path: ', `${path}/sprite/${pad}/AnimData.xml`)
                missing += `${mapName.get(index)},${pad}/AnimData.xml\n`
            }
        }
    }

    console.log(durations)
    const fileA = fs.createWriteStream('sheets/durations.json')
    fileA.on('error', function(err) {
      console.log(err)
    })
    fileA.write(JSON.stringify(durations))
    fileA.end()

    const fileB = fs.createWriteStream('sheets/missing.txt')
    fileB.on('error', function(err) {
      console.log(err)
    })
    fileB.write(missing)
    fileB.end()
}

function removeBlue(cropImg){
    cropImg.scan(0,0,cropImg.bitmap.width,cropImg.bitmap.height, (x,y,idx)=> {
        if (cropImg.bitmap.data[idx] == 0 
            && cropImg.bitmap.data[idx + 1] == 0
            && cropImg.bitmap.data[idx + 2] != 0) {
            cropImg.bitmap.data[idx] = 0
            cropImg.bitmap.data[idx + 1] = 0
            cropImg.bitmap.data[idx + 2] = 0
            cropImg.bitmap.data[idx + 3] = 0
        }
    })
}

function removeRed(cropImg){
    cropImg.scan(0,0,cropImg.bitmap.width,cropImg.bitmap.height, (x,y,idx)=> {
        if (cropImg.bitmap.data[idx] != 0 
            && cropImg.bitmap.data[idx + 1] == 0
            && cropImg.bitmap.data[idx + 2] == 0) {
            cropImg.bitmap.data[idx] = 0
            cropImg.bitmap.data[idx + 1] = 0
            cropImg.bitmap.data[idx + 2] = 0
            cropImg.bitmap.data[idx + 3] = 0
        }
    })
}

function zeroPad(num: number) {
    return ('0000'+num).slice(-4)
}

split()