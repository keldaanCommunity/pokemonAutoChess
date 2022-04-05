#ts-node split.ts SpriteCollab
#TexturePacker.exe --verbose --pack-mode Good --multipack --sheet sheets/pokemons${n}.png --data sheets/pokemons${n}.json --texture-format png8 --format phaser  --trim-sprite-names ./split
ts-node minify.ts