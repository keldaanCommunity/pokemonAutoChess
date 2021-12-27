import React, { Component } from 'react';
import {MAP_TYPE_NAME} from '../../../../models/enum';

class Tileset extends Component{
    render(){
        return <div>
            <p>{MAP_TYPE_NAME[this.props.type]['eng']} ({this.props.wins} wins)</p>
            <progress className="nes-progress is-error" value={this.props.wins} max="100"></progress>
            <table style={{width:'100%'}}>
                <tbody>
                    <tr>
                        <td><button className="invisibleButton" onClick={()=>{this.props.changeMap(this.props.type, 0)}}><img src={"/assets/tiles/" + this.props.type + "/" + this.props.type + "0-preview.png"} title="Default map"/></button></td>
                        <td><button className="invisibleButton" onClick={()=>{this.props.changeMap(this.props.type, 1)}}><img src={"/assets/tiles/" + this.props.type + "/" + this.props.type + "1-preview.png"}   style={{filter:this.props.wins >= 5 ?'grayscale(0)':'grayscale(1)'}} title={"Unlocked after 5 wins in " + MAP_TYPE_NAME[this.props.type]['eng']}/></button></td>
                        <td><button className="invisibleButton" onClick={()=>{this.props.changeMap(this.props.type, 2)}}><img src={"/assets/tiles/" + this.props.type + "/" + this.props.type + "2-preview.png"}   style={{filter:this.props.wins >= 10 ?'grayscale(0)':'grayscale(1)'}} title={"Unlocked after 10 wins in " + MAP_TYPE_NAME[this.props.type]['eng']}/></button></td>
                        <td><button className="invisibleButton" onClick={()=>{this.props.changeMap(this.props.type, 3)}}><img src={"/assets/tiles/" + this.props.type + "/" + this.props.type + "3-preview.png"}   style={{filter:this.props.wins >= 20 ?'grayscale(0)':'grayscale(1)'}} title={"Unlocked after 20 wins in " + MAP_TYPE_NAME[this.props.type]['eng']}/></button></td>
                        <td><button className="invisibleButton" onClick={()=>{this.props.changeMap(this.props.type, 4)}}><img src={"/assets/tiles/" + this.props.type + "/" + this.props.type + "4-preview.png"}   style={{filter:this.props.wins >= 40 ?'grayscale(0)':'grayscale(1)'}} title={"Unlocked after 40 wins in " + MAP_TYPE_NAME[this.props.type]['eng']}/></button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    }
}

export default Tileset;