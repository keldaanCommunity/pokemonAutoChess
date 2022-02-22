import React, { Component } from 'react';
import {BASIC_ITEM, ITEM_DESCRIPTION, ITEM_NAME, ITEM_RECIPE} from '../../../../models/enum';

class WikiItem extends Component {
  render() {
      let recipe;
      if(Object.keys(BASIC_ITEM).includes(this.props.item)){
          recipe = <div>
              {
                  Object.keys(ITEM_RECIPE).map(recipeName=>{
                    if(ITEM_RECIPE[recipeName].includes(this.props.item)){
                        return <div style={{display:'flex', padding:'5px'}} key={recipeName}>
                            <img style={{imageRendering:'pixelated', width:'40px', height:'40px'}} src={"assets/item/" + ITEM_RECIPE[recipeName][0] + ".png"}></img>
                            +
                            <img style={{imageRendering:'pixelated', width:'40px', height:'40px'}} src={"assets/item/" + ITEM_RECIPE[recipeName][1] + ".png"}></img>
                            =
                            <img style={{imageRendering:'pixelated', width:'40px', height:'40px'}} src={"assets/item/" + recipeName + ".png"}></img>
                            <p>{ITEM_NAME[recipeName]}:</p>
                            <p>{ITEM_DESCRIPTION[recipeName]}</p>
                        </div>
                    }
                    else{
                        return null;
                    }
                  })
              }
          </div>;
      }
      else{
          recipe = <div style={{display:'flex', padding:'5px'}}>
                <img style={{imageRendering:'pixelated', width:'40px', height:'40px'}} src={"assets/item/" + ITEM_RECIPE[this.props.item][0] + ".png"}></img>
                +
                <img style={{imageRendering:'pixelated', width:'40px', height:'40px'}} src={"assets/item/" + ITEM_RECIPE[this.props.item][1] + ".png"}></img>
                =
                <img style={{imageRendering:'pixelated', width:'40px', height:'40px'}} src={"assets/item/" + this.props.item + ".png"}></img>
          </div>
      }
    return (            
        <div>
            <div style={{display:'flex'}}>
                <img style={{imageRendering:'pixelated', width:'40px', height:'40px'}} src={"assets/item/" + this.props.item + ".png"}></img>
                <p>{ITEM_NAME[this.props.item]}</p>
            </div>
            <p>{ITEM_DESCRIPTION[this.props.item]}</p>
            {recipe}
        </div>
    );
  }
}
export default WikiItem;
