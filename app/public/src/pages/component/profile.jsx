import React, { Component } from 'react';
import { XP_TABLE } from '../../../../models/enum';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import TilesetMenu from './tileset-menu';
import Elo from './elo';

class Profile extends Component {

    constructor(props){
        super(props);
        this.state={
            inputValue:''
        }
    }

    handleInputValueChange(event){
        this.setState({
            inputValue:event.target.value
        });
    }

    handleChangeName(){
        this.props.changeName(this.state.inputValue);
    }

  render() {
      if(this.props.user.mapWin){
        return (
            <div>
                <div style={{display:'flex', alignItems: 'center'}}>
                    <img src={"/assets/avatar/" + this.props.user.avatar + ".png"}/>
                    <h5>{this.props.user.name}</h5>
                </div>
                <p>Level {this.props.user.level} ({this.props.user.exp} / {XP_TABLE[this.props.user.level]})</p>
                <p>Langage: {this.props.user.langage}</p>
                <p style={{display:'flex', alignItems:'center'}}>Elo: <Elo elo={this.props.user.elo}/></p>
                <p>Wins: {this.props.user.wins}</p>
                <p>Tipee contributor: {this.props.user.donor ? 'Yes': 'No'}</p>
    
                <Tabs>
                    <TabList>
                    <Tab>Name</Tab>
                    <Tab>Avatar</Tab>
                    <Tab>Tileset</Tab>
                    </TabList>
    
                    <TabPanel>
                        <div>
                            <h5>Change Name</h5>
                            <div className="nes-field is-inline">
                                <input type="text" id="inline_field" className="nes-input" placeholder={this.props.user.name} onChange={this.handleInputValueChange.bind(this)}/>
                                <button className="nes-btn is-primary" onClick={this.handleChangeName.bind(this)}>Change</button>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div>
                            <h5>Change Avatar</h5>
                            <table style={{width: '100%'}}>
                                <tbody>
                                    <tr>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('rattata')}}><img src="assets/avatar/rattata.png" style={{filter:this.props.user.level >= 0 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 0"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('pidgey')}}><img src="assets/avatar/pidgey.png" style={{filter:this.props.user.level >= 1 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 1"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('spearow')}}><img src="assets/avatar/spearow.png" style={{filter:this.props.user.level >= 2 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 2"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('caterpie')}}><img src="assets/avatar/caterpie.png" style={{filter:this.props.user.level >= 3 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 3"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('weedle')}}><img src="assets/avatar/weedle.png" style={{filter:this.props.user.level >= 4 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 4"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('igglybuff')}}><img src="assets/avatar/igglybuff.png" style={{filter:this.props.user.level >= 5 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 5"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('seedot')}}><img src="assets/avatar/seedot.png" style={{filter:this.props.user.level >= 6 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 6"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('zubat')}}><img src="assets/avatar/zubat.png" style={{filter:this.props.user.level >= 7 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 7"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('sandshrew')}}><img src="assets/avatar/sandshrew.png" style={{filter:this.props.user.level >= 8 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 8"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('pikachu')}}><img src="assets/avatar/pikachu.png" style={{filter:this.props.user.level >= 9 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 9"/></button></td>
                                    </tr>
                                    <tr>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('nidoranF')}}><img src="assets/avatar/nidoranF.png" style={{filter:this.props.user.level >= 10 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 10"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('machop')}}><img src="assets/avatar/machop.png" style={{filter:this.props.user.level >= 11 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 11"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('geodude')}}><img src="assets/avatar/geodude.png" style={{filter:this.props.user.level >= 12 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 12"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('eevee')}}><img src="assets/avatar/eevee.png" style={{filter:this.props.user.level >= 13 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 13"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('poliwag')}}><img src="assets/avatar/poliwag.png" style={{filter:this.props.user.level >= 14 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 14"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('turtwig')}}><img src="assets/avatar/turtwig.png" style={{filter:this.props.user.level >= 15 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 15"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('togepi')}}><img src="assets/avatar/togepi.png" style={{filter:this.props.user.level >= 16 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 16"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('ralts')}}><img src="assets/avatar/ralts.png" style={{filter:this.props.user.level >= 17 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 17"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('nidoranM')}}><img src="assets/avatar/nidoranM.png" style={{filter:this.props.user.level >= 18 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 18"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('slakoth')}}><img src="assets/avatar/slakoth.png" style={{filter:this.props.user.level >= 19 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 19"/></button></td>
                                    </tr>
                                    <tr>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('growlithe')}}><img src="assets/avatar/growlithe.png" style={{filter:this.props.user.level >= 20 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 20"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('numel')}}><img src="assets/avatar/numel.png" style={{filter:this.props.user.level >= 21 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 21"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('abra')}}><img src="assets/avatar/abra.png" style={{filter:this.props.user.level >= 22 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 22"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('horsea')}}><img src="assets/avatar/horsea.png" style={{filter:this.props.user.level >= 23 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 23"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('gastly')}}><img src="assets/avatar/gastly.png" style={{filter:this.props.user.level >= 24 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 24"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('mudkip')}}><img src="assets/avatar/mudkip.png" style={{filter:this.props.user.level >= 25 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 25"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('archen')}}><img src="assets/avatar/archen.png" style={{filter:this.props.user.level >= 26 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 26"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('tirtouga')}}><img src="assets/avatar/tirtouga.png" style={{filter:this.props.user.level >= 27 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 27"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('omanyte')}}><img src="assets/avatar/omanyte.png" style={{filter:this.props.user.level >= 28 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 28"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('kabuto')}}><img src="assets/avatar/kabuto.png" style={{filter:this.props.user.level >= 29 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 29"/></button></td>
                                    </tr>
                                    <tr>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('lileep')}}><img src="assets/avatar/lileep.png" style={{filter:this.props.user.level >= 30 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 30"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('shieldon')}}><img src="assets/avatar/shieldon.png" style={{filter:this.props.user.level >= 31 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 31"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('amaura')}}><img src="assets/avatar/amaura.png" style={{filter:this.props.user.level >= 32 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 32"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('tyrunt')}}><img src="assets/avatar/tyrunt.png" style={{filter:this.props.user.level >= 33 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 33"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('cranidos')}}><img src="assets/avatar/cranidos.png" style={{filter:this.props.user.level >= 34 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 34"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('aerodactyl')}}><img src="assets/avatar/aerodactyl.png" style={{filter:this.props.user.level >= 35 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 35"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('trapinch')}}><img src="assets/avatar/trapinch.png" style={{filter:this.props.user.mapWin.GROUND >= 5 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked after  5 wins Glimmer Desert"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('vibrava')}}><img src="assets/avatar/vibrava.png" style={{filter:this.props.user.mapWin.GROUND >= 10 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked after  10 wins Glimmer Desert"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('flygon')}}><img src="assets/avatar/flygon.png" style={{filter:this.props.user.mapWin.GROUND >= 25 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked after  25 wins Glimmer Desert"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('regirock')}}><img src="assets/avatar/regirock.png" style={{filter:this.props.user.mapWin.GROUND >= 100 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked after  100 wins Glimmer Desert"/></button></td>
                                    </tr>        
                                    <tr>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('bagon')}}><img src="assets/avatar/bagon.png" style={{filter:this.props.user.mapWin.NORMAL >= 5 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked after  5 wins Tiny Woods"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('shelgon')}}><img src="assets/avatar/shelgon.png" style={{filter:this.props.user.mapWin.NORMAL >= 10 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked after  10 wins Tiny Woods"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('salamence')}}><img src="assets/avatar/salamence.png" style={{filter:this.props.user.mapWin.NORMAL >= 25 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked after  25 wins Tiny Woods"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('rayquaza')}}><img src="assets/avatar/rayquaza.png" style={{filter:this.props.user.mapWin.NORMAL >= 100 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked after  100 wins Tiny Woods"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('spheal')}}><img src="assets/avatar/spheal.png" style={{filter:this.props.user.mapWin.ICE >= 5 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked after  5 wins Frosty Forest"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('sealeo')}}><img src="assets/avatar/sealeo.png" style={{filter:this.props.user.mapWin.ICE >= 10 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked after  10 wins Frosty Forest"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('walrein')}}><img src="assets/avatar/walrein.png" style={{filter:this.props.user.mapWin.ICE >= 25 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked after  25 wins Frosty Forest"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('articuno')}}><img src="assets/avatar/articuno.png" style={{filter:this.props.user.mapWin.ICE >= 100 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked after  100 wins Frosty Forest"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('bulbasaur')}}><img src="assets/avatar/bulbasaur.png" alt="" style={{filter:this.props.user.mapWin.GRASS >= 5 ?'grayscale(0)':'grayscale(1)'}} title="Unlocked after  5 wins Hidden Highland"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('ivysaur')}}><img src="assets/avatar/ivysaur.png" alt="" style={{filter:this.props.user.mapWin.GRASS >= 10 ?'grayscale(0)':'grayscale(1)'}}  title="Unlocked after  10 wins Hidden Highland"/></button></td>
                                    </tr>
                                    <tr>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('venusaur')}}><img src="assets/avatar/venusaur.png" alt="" style={{filter:this.props.user.mapWin.GRASS >= 25 ?'grayscale(0)':'grayscale(1)'}}  title="Unlocked after  25 wins Hidden Highland"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('shaymin')}}><img src="assets/avatar/shaymin.png" alt="" style={{filter:this.props.user.mapWin.GRASS >= 100 ?'grayscale(0)':'grayscale(1)'}}  title="Unlocked after  100 wins Hidden Highland"/></button></td>    
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('cyndaquil')}}><img src="assets/avatar/cyndaquil.png" style={{filter:this.props.user.mapWin.FIRE >= 5 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked after  5 wins Magma Cavern"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('quilava')}}><img src="assets/avatar/quilava.png" style={{filter:this.props.user.mapWin.FIRE >= 10 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked after  10 wins Magma Cavern"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('typlosion')}}><img src="assets/avatar/typlosion.png" style={{filter:this.props.user.mapWin.FIRE >= 25 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked after  25 wins Magma Cavern"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('entei')}}><img src="assets/avatar/entei.png" style={{filter:this.props.user.mapWin.FIRE >= 100 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked after  100 wins Magma Cavern"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('squirtle')}}><img src="assets/avatar/squirtle.png" style={{filter:this.props.user.mapWin.WATER >= 5 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked after  5 wins Stormy Sea"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('wartortle')}}><img src="assets/avatar/wartortle.png" style={{filter:this.props.user.mapWin.WATER >= 10 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked after  10 wins Stormy Sea"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('blastoise')}}><img src="assets/avatar/blastoise.png" style={{filter:this.props.user.mapWin.WATER >= 25 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked after  25 wins Stormy Sea"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('kyogre')}}><img src="assets/avatar/kyogre.png" style={{filter:this.props.user.mapWin.WATER >= 100 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked after  100 wins Stormy Sea"/></button></td>
                                    </tr>
                                    <tr>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('meowth')}}><img src="assets/avatar/meowth.png" alt="" style={{filter:this.props.user.donor ?'grayscale(0)':'grayscale(1)'}}  title="Unlocked after contributing to the tipee"/></button></td>
                                    <td><button className="invisibleButton" onClick={()=>{this.props.changeAvatar('persian')}}><img src="assets/avatar/persian.png" alt="" style={{filter:this.props.user.donor ?'grayscale(0)':'grayscale(1)'}}  title="Unlocked after contributing to the tipee"/></button></td>
                                    </tr>
                                </tbody>
                                </table>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div>
                            <h5>Change Tileset</h5>
                            <TilesetMenu mapWin={this.props.user.mapWin} changeMap={this.props.changeMap}/>
                        </div>
                    </TabPanel>
                </Tabs>
          </div>
        );
      }
      else{
          return null;
      }

  }
}
export default Profile;
