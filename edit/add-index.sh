#!/bin/bash
read -e -p 'Enter SpriteCollab repo local folder path: ' SpriteCollabPath
read -e -p 'Enter index of pokemon to add: ' IndexToAdd
ts-node split.ts $SpriteCollabPath $IndexToAdd
TexturePacker --pack-mode Good --sheet sheets/${IndexToAdd}.png --data sheets/${IndexToAdd}.json --texture-format png8 --format phaser  --trim-sprite-names ./split/${IndexToAdd}
ts-node minify.ts $IndexToAdd
ts-node move.ts $SpriteCollabPath $IndexToAdd