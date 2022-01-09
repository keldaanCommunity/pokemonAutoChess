import React, { Component } from 'react';

class GameMoneyDetail extends Component{

    render(){
        return <div>
            <div>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <p>Streak:</p>
                    <div>
                        {this.props.streak}
                        <img style={{width:'20px', height:'20px', marginBottom:'5px'}} src="/assets/ui/money.png"/>
                    </div>
                    
                </div>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <p>Interest:</p>
                    <div>
                        {this.props.interest}
                        <img style={{width:'20px', height:'20px', marginBottom:'5px'}} src="/assets/ui/money.png"/>
                    </div>
                </div>
            </div>
        </div>
    }

    getLastBattleResult() {
        if (this.props.history.length > 0) {
          return this.props.history[this.props.history.length - 1].result;
        } else {
          return '';
        }
      }
}

export default GameMoneyDetail;