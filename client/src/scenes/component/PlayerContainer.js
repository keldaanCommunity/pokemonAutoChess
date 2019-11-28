import PlayerPortraitContainer from './PlayerPortraitContainer';

export default class PlayerContainer extends Phaser.GameObjects.Container
{
    constructor(scene, x, y)
    {
        super(scene,x ,y);
        this.buildPlayerPortraits();
        scene.add.existing(this);
    }

    buildPlayerPortraits(){

        let i = 0;
        for (let id in window.state.players)
        {
            this.add(new PlayerPortraitContainer(this.scene, 0, 100 *i, window.state.players[id]));
            i +=1;
        }
    }

    updatePortraits(){
        this.removeAll();
        this.buildPlayerPortraits();
    }
    
}