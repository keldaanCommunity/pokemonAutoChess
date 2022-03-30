import React, { useState } from 'react';
import { XP_TABLE } from '../../../../../models/enum';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Elo from '../elo';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { changeAvatar, changeName } from '../../../stores/NetworkStore';
export default function Profile() {
    const dispatch = useAppDispatch();
    const [inputValue, setInputValue] = useState<string>('');
    const user = useAppSelector(state=>state.lobby.user);

    return(
        <div>
        <div style={{display:'flex', alignItems: 'center'}}>
            <img src={"/assets/avatar/" + user.avatar + ".png"}/>
            <h5>{user.name}</h5>
        </div>
        <p>Level {user.level} ({user.exp} / {XP_TABLE[user.level]})</p>
        <p>Langage: {user.langage}</p>
        <div style={{display:'flex', alignItems:'center'}}>Elo: <Elo elo={user.elo}/></div>
        <p>Wins: {user.wins}</p>
        <p>Tipee contributor: {user.donor ? 'Yes': 'No'}</p>

        <Tabs>
            <TabList>
            <Tab>Name</Tab>
            <Tab>Avatar</Tab>
            </TabList>

            <TabPanel>
                <div>
                    <h5>Change Name</h5>
                    <div className="nes-field is-inline">
                        <input type="text" id="inline_field" className="nes-input" placeholder={user.name} onChange={e=>{setInputValue(e.target.value)}}/>
                        <button className="nes-btn is-primary" onClick={()=>dispatch(changeName(inputValue))}>Change</button>
                    </div>
                </div>
            </TabPanel>
            <TabPanel>
                <div>
                    <h5>Change Avatar</h5>
                    <table style={{width: '100%'}}>
                        <tbody>
                            <tr>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('rattata'))}}><img src="assets/avatar/rattata.png" style={{filter:user.level >= 0 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 0"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('pidgey'))}}><img src="assets/avatar/pidgey.png" style={{filter:user.level >= 1 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 1"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('spearow'))}}><img src="assets/avatar/spearow.png" style={{filter:user.level >= 2 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 2"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('caterpie'))}}><img src="assets/avatar/caterpie.png" style={{filter:user.level >= 3 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 3"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('weedle'))}}><img src="assets/avatar/weedle.png" style={{filter:user.level >= 4 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 4"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('igglybuff'))}}><img src="assets/avatar/igglybuff.png" style={{filter:user.level >= 5 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 5"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('seedot'))}}><img src="assets/avatar/seedot.png" style={{filter:user.level >= 6 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 6"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('zubat'))}}><img src="assets/avatar/zubat.png" style={{filter:user.level >= 7 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 7"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('sandshrew'))}}><img src="assets/avatar/sandshrew.png" style={{filter:user.level >= 8 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 8"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('pikachu'))}}><img src="assets/avatar/pikachu.png" style={{filter:user.level >= 9 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 9"/></button></td>
                            </tr>
                            <tr>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('nidoranF'))}}><img src="assets/avatar/nidoranF.png" style={{filter:user.level >= 10 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 10"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('machop'))}}><img src="assets/avatar/machop.png" style={{filter:user.level >= 11 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 11"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('geodude'))}}><img src="assets/avatar/geodude.png" style={{filter:user.level >= 12 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 12"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('eevee'))}}><img src="assets/avatar/eevee.png" style={{filter:user.level >= 13 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 13"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('poliwag'))}}><img src="assets/avatar/poliwag.png" style={{filter:user.level >= 14 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 14"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('turtwig'))}}><img src="assets/avatar/turtwig.png" style={{filter:user.level >= 15 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 15"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('togepi'))}}><img src="assets/avatar/togepi.png" style={{filter:user.level >= 16 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 16"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('ralts'))}}><img src="assets/avatar/ralts.png" style={{filter:user.level >= 17 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 17"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('nidoranM'))}}><img src="assets/avatar/nidoranM.png" style={{filter:user.level >= 18 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 18"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('slakoth'))}}><img src="assets/avatar/slakoth.png" style={{filter:user.level >= 19 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 19"/></button></td>
                            </tr>
                            <tr>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('growlithe'))}}><img src="assets/avatar/growlithe.png" style={{filter:user.level >= 20 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 20"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('numel'))}}><img src="assets/avatar/numel.png" style={{filter:user.level >= 21 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 21"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('abra'))}}><img src="assets/avatar/abra.png" style={{filter:user.level >= 22 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 22"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('horsea'))}}><img src="assets/avatar/horsea.png" style={{filter:user.level >= 23 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 23"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('gastly'))}}><img src="assets/avatar/gastly.png" style={{filter:user.level >= 24 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 24"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('mudkip'))}}><img src="assets/avatar/mudkip.png" style={{filter:user.level >= 25 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 25"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('archen'))}}><img src="assets/avatar/archen.png" style={{filter:user.level >= 26 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 26"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('tirtouga'))}}><img src="assets/avatar/tirtouga.png" style={{filter:user.level >= 27 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 27"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('omanyte'))}}><img src="assets/avatar/omanyte.png" style={{filter:user.level >= 28 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 28"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('kabuto'))}}><img src="assets/avatar/kabuto.png" style={{filter:user.level >= 29 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 29"/></button></td>
                            </tr>
                            <tr>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('lileep'))}}><img src="assets/avatar/lileep.png" style={{filter:user.level >= 30 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 30"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('shieldon'))}}><img src="assets/avatar/shieldon.png" style={{filter:user.level >= 31 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 31"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('amaura'))}}><img src="assets/avatar/amaura.png" style={{filter:user.level >= 32 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 32"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('tyrunt'))}}><img src="assets/avatar/tyrunt.png" style={{filter:user.level >= 33 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 33"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('cranidos'))}}><img src="assets/avatar/cranidos.png" style={{filter:user.level >= 34 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 34"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('aerodactyl'))}}><img src="assets/avatar/aerodactyl.png" style={{filter:user.level >= 35 ?'grayscale(0)':'grayscale(1)'}} alt=""  title="Unlocked at level 35"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('trapinch'))}}><img src="assets/avatar/trapinch.png" style={{filter: 'grayscale(1)'}} alt=""  title="Unlocked after  5 wins Glimmer Desert"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('vibrava'))}}><img src="assets/avatar/vibrava.png" style={{filter: 'grayscale(1)'}} alt=""  title="Unlocked after  10 wins Glimmer Desert"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('flygon'))}}><img src="assets/avatar/flygon.png" style={{filter: 'grayscale(1)'}} alt=""  title="Unlocked after  25 wins Glimmer Desert"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('regirock'))}}><img src="assets/avatar/regirock.png" style={{filter: 'grayscale(1)'}} alt=""  title="Unlocked after  100 wins Glimmer Desert"/></button></td>
                            </tr>        
                            <tr>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('bagon'))}}><img src="assets/avatar/bagon.png" style={{filter: 'grayscale(1)'}} alt=""  title="Unlocked after  5 wins Tiny Woods"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('shelgon'))}}><img src="assets/avatar/shelgon.png" style={{filter: 'grayscale(1)'}} alt=""  title="Unlocked after  10 wins Tiny Woods"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('salamence'))}}><img src="assets/avatar/salamence.png" style={{filter: 'grayscale(1)'}} alt=""  title="Unlocked after  25 wins Tiny Woods"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('rayquaza'))}}><img src="assets/avatar/rayquaza.png" style={{filter: 'grayscale(1)'}} alt=""  title="Unlocked after  100 wins Tiny Woods"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('spheal'))}}><img src="assets/avatar/spheal.png" style={{filter: 'grayscale(1)'}} alt=""  title="Unlocked after  5 wins Frosty Forest"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('sealeo'))}}><img src="assets/avatar/sealeo.png" style={{filter: 'grayscale(1)'}} alt=""  title="Unlocked after  10 wins Frosty Forest"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('walrein'))}}><img src="assets/avatar/walrein.png" style={{filter: 'grayscale(1)'}} alt=""  title="Unlocked after  25 wins Frosty Forest"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('articuno'))}}><img src="assets/avatar/articuno.png" style={{filter: 'grayscale(1)'}} alt=""  title="Unlocked after  100 wins Frosty Forest"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('bulbasaur'))}}><img src="assets/avatar/bulbasaur.png" alt="" style={{filter: 'grayscale(1)'}} title="Unlocked after  5 wins Hidden Highland"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('ivysaur'))}}><img src="assets/avatar/ivysaur.png" alt="" style={{filter: 'grayscale(1)'}}  title="Unlocked after  10 wins Hidden Highland"/></button></td>
                            </tr>
                            <tr>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('venusaur'))}}><img src="assets/avatar/venusaur.png" alt="" style={{filter: 'grayscale(1)'}}  title="Unlocked after  25 wins Hidden Highland"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('shaymin'))}}><img src="assets/avatar/shaymin.png" alt="" style={{filter: 'grayscale(1)'}}  title="Unlocked after  100 wins Hidden Highland"/></button></td>    
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('cyndaquil'))}}><img src="assets/avatar/cyndaquil.png" style={{filter: 'grayscale(1)'}} alt=""  title="Unlocked after  5 wins Magma Cavern"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('quilava'))}}><img src="assets/avatar/quilava.png" style={{filter: 'grayscale(1)'}} alt=""  title="Unlocked after  10 wins Magma Cavern"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('typlosion'))}}><img src="assets/avatar/typlosion.png" style={{filter: 'grayscale(1)'}} alt=""  title="Unlocked after  25 wins Magma Cavern"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('entei'))}}><img src="assets/avatar/entei.png" style={{filter: 'grayscale(1)'}} alt=""  title="Unlocked after  100 wins Magma Cavern"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('squirtle'))}}><img src="assets/avatar/squirtle.png" style={{filter: 'grayscale(1)'}} alt=""  title="Unlocked after  5 wins Stormy Sea"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('wartortle'))}}><img src="assets/avatar/wartortle.png" style={{filter: 'grayscale(1)'}} alt=""  title="Unlocked after  10 wins Stormy Sea"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('blastoise'))}}><img src="assets/avatar/blastoise.png" style={{filter: 'grayscale(1)'}} alt=""  title="Unlocked after  25 wins Stormy Sea"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('kyogre'))}}><img src="assets/avatar/kyogre.png" style={{filter: 'grayscale(1)'}} alt=""  title="Unlocked after  100 wins Stormy Sea"/></button></td>
                            </tr>
                            <tr>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('meowth'))}}><img src="assets/avatar/meowth.png" alt="" style={{filter:user.donor ?'grayscale(0)':'grayscale(1)'}}  title="Unlocked after contributing to the tipee"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('persian'))}}><img src="assets/avatar/persian.png" alt="" style={{filter:user.donor ?'grayscale(0)':'grayscale(1)'}}  title="Unlocked after contributing to the tipee"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('absol'))}}><img src="assets/avatar/absol.png" alt="" style={{filter:user.honors.includes('absol') ?'grayscale(0)':'grayscale(1)'}}  title="Unlocked after partipating in Tournament #1"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('meloetta'))}}><img src="assets/avatar/meloetta.png" alt="" style={{filter:user.honors.includes('meloetta') ?'grayscale(0)':'grayscale(1)'}}  title="Unlocked after partipating in Tournament #2"/></button></td>
                            <td><button className="invisibleButton" onClick={()=>{dispatch(changeAvatar('zapdos'))}}><img src="assets/avatar/zapdos.png" alt="" style={{filter:user.honors.includes('zapdos') ?'grayscale(0)':'grayscale(1)'}}  title="Unlocked after partipating in Tournament #3"/></button></td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                    
                    </div>
                </div>
            </TabPanel>
        </Tabs>
  </div>
    )
}