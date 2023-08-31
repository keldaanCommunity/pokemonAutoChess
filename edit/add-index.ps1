$SpriteCollabPath = Read-Host -Prompt 'Enter SpriteCollab repo local folder path'
$IndexToAdd = Read-Host -Prompt 'Enter index of pokemon to add'
ts-node split.ts $SpriteCollabPath $IndexToAdd
TexturePacker.exe --verbose --pack-mode Good --sheet sheets/${IndexToAdd}.png --data sheets/${IndexToAdd}.json --texture-format png8 --format phaser  --trim-sprite-names ./split/${IndexToAdd}
ts-node minify.ts $IndexToAdd
ts-node move.ts $SpriteCollabPath $IndexToAdd