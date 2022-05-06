import React, { Component } from 'react';
import { ITEM_RECIPE } from '../../../../../types/Config';
import { ItemDescription, ItemName } from '../../../../../types/strings/Item';
import { BasicItems } from '../../../../../types/enum/Item';
import ReactTooltip from 'react-tooltip';

class WikiItemsCheatSheet extends Component {
  render() {
    const imgStyle = {imageRendering:'pixelated', width: '50px', height:'50px', cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`};
    return <div style={{display:'flex', justifyContent:'center'}}>
        <table>
            <tbody>
                <tr>
                    <td></td>
                    {BasicItems.map(i=>{
                        return <th key={i} style={{paddingBottom:'30px'}}><img style={imgStyle} src={"assets/item/" + i + ".png"}></img></th>
                    })}
                </tr>
                {BasicItems.map(i=>{
                    return <tr key={'tr-'+i}>
                        <th style={{paddingRight:'30px'}}><img style={imgStyle} src={"assets/item/" + i + ".png"}></img></th>
                        {BasicItems.map(j=>{
                            let tier2Item;
                            Object.keys(ITEM_RECIPE).forEach(recipeName=>{
                                if((ITEM_RECIPE[recipeName][0] == i && ITEM_RECIPE[recipeName][1] == j) || (ITEM_RECIPE[recipeName][0] == j && ITEM_RECIPE[recipeName][1] == i)){
                                    tier2Item = recipeName;
                                }
                            });
                            return <td 
                            style={{paddingRight:'5px'}} 
                            key={'td-'+i +'-'+j}
                            data-tip
                            data-for={'detail-' + i + '-' + j}>
                                <img style={imgStyle} src={"assets/item/" + tier2Item + ".png"}></img>
                                <ReactTooltip id={'detail-' + i + '-' + j} 
                                className='customeTheme' 
                                textColor='#000000' 
                                backgroundColor='rgba(255,255,255,1)' 
                                effect='solid'>
                                    <p>{ItemName[tier2Item]}</p>
                                    <p>{ItemDescription[tier2Item]}</p>
                                </ReactTooltip>
                                </td>
                        })}
                    </tr>
                })}         
            </tbody>
        </table>
    </div>;
  }
}
export default WikiItemsCheatSheet;
