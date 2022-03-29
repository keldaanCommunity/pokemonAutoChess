import React from 'react';

const ulStyle = {
    listStyle: 'none',
    padding: '0px',
    display: 'flex'
};

export default function Team(props:{team: string[]}){

    return <ul style={ulStyle}>
        {props.team.map((v, index)=>{        
            return <li key={index}>
            <img src={"/assets/avatar/" + v + ".png"}/>
        </li>})}
    </ul>
}