import React, { Component } from 'react';

class GameExperience extends Component{

    render(){
        const style = {
            position:'absolute',
            right: '1%',
            bottom: '0%',
            width: '15%'
        }

        let progressString = ''
        if(Number(this.props.experienceNeeded) == -1)
        {
            progressString = 'Max Level'
        }
        else
        {
            progressString = this.props.experience + "/" + this.props.experienceNeeded
        }
        

        return <div style={style}>
            <h1>Lvl {this.props.level}</h1>
            <div>
                <progress className="nes-progress" value={this.props.experience} max={this.props.experienceNeeded}></progress>
                <p style={{
                    position: 'absolute',
                    color: 'darkgray',
                    left: '25%',
                    bottom: '3%'
                }}>
                    {progressString}</p>
            </div>
        </div>;
    }
}

export default GameExperience;