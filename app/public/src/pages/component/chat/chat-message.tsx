import React from 'react';
import { useAppDispatch } from '../../../hooks';
import { searchName } from '../../../stores/NetworkStore';
import { setTabIndex } from '../../../stores/LobbyStore';
import { IMessage } from '../../../../../types';
import {CDN_URL} from '../../../../../models/enum';

export default function ChatMessage(props: {message: IMessage}) {
    const dispatch = useAppDispatch();
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
            onClick={()=>{
                dispatch(searchName(props.message.name));
                dispatch(setTabIndex(3));
            }}
            >
                <img style={{marginRight: '10px'}} src={`${CDN_URL}${props.message.avatar}.png`} />
                <span>{props.message.name}</span>
                <span>{formatDate(props.message.time)}</span>
            </div>
            <p>{props.message.payload}</p>
        </div>
    );
}

function pad(number: number) {
    if ( number < 10 ) {
        return '0' + number;
        }
    return number;
}


function formatDate(n: number) {
    const date = new Date(n);
    return  pad( date.getUTCMonth() + 1 ) +
        '/' + pad( date.getUTCDate() ) +
        ' ' + pad( date.getUTCHours() ) +
        ':' + pad( date.getUTCMinutes() )
}