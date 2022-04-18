#ts-node split.ts C:\Users\DELL\Desktop\SpriteCollab
#foreach ($item in Get-ChildItem ./split) {
#    TexturePacker.exe --verbose --pack-mode Good --sheet sheets/${item}.png --data sheets/${item}.json --texture-format png8 --format phaser  --trim-sprite-names ./split/${item}
#}
#ts-node minify.ts
quicktype sheets/tracker.json -o sheets/ITracker.ts
ts-node move.ts C:\Users\DELL\Desktop\SpriteCollab