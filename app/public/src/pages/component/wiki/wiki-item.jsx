import React, { Component } from 'react';
import {BasicItems, ItemDescription, ItemName, ITEM_RECIPE} from '../../../../models/enum';

class WikiItem extends Component {
  render() {
      let recipe;
      if(BasicItems.includes(this.props.item)){
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
                            <p>{ItemName[recipeName]}:</p>
                            <p>{ItemDescription[recipeName]}</p>
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
                <p>{ItemName[this.props.item]}</p>
            </div>
            <p>{ItemDescription[this.props.item]}</p>
            {recipe}
        </div>
    );
  }
}
export default WikiItem;
