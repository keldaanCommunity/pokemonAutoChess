import React from 'react';

export default class ChatMessage extends React.Component{
    render() {
        return(
            <div className="nes-container with-title" style={{
                backgroundColor: '#fff'
            }}>
                <div className="title" style={{
                    display: 'flex',
                    flexFlow: 'row nowrap',
                    alignItems: 'center',
                    cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`,
                    justifyContent: 'space-between'
                }}
                onClick={()=>this.props.displayInfo(this.props.message.name)}
                >
                    <img style={{marginRight: '10px'}} src={`assets/avatar/${this.props.message.avatar}.png`} />
                    <span>{this.props.message.name}</span>
                    <span>{this.formatDate(this.props.message.time)}</span>
                </div>
                <p>{this.props.message.payload}</p>
            </div>
        );
     }

     
    pad(number) {
        if ( number < 10 ) {
            return '0' + number;
            }
        return number;
    }
    

    formatDate(n) {
        let date = new Date(n);
        return  this.pad( date.getUTCMonth() + 1 ) +
            '/' + this.pad( date.getUTCDate() ) +
            ' ' + this.pad( date.getUTCHours() ) +
            ':' + this.pad( date.getUTCMinutes() )
    };
 }