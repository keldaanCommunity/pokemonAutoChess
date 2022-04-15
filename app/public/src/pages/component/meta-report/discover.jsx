import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import {CDN_URL} from '../../../../../models/enum';
import PokemonFactory from '../../../../../models/pokemon-factory';
import { Emotion } from '../../../../../types';

class Discover extends Component{

    constructor(props) {
        super(props);
        let self = this;
        this.cursorStyle = `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`;

        this.typeStyle = '"display:flex; flex-flow:column;align-items:center"'

        this.options = {
            grid:{
                show:false
            },
            yaxis:{
                show: false
            },
            xaxis:{
                labels:{
                    show: false
                }
            },
            legend: {
                fontFamily: 'Press Start 2P'
            },
            chart: {
                height: 350,
                type: 'bubble',
                },
            dataLabels: {
                enabled: false
            },
            fill: {
                opacity: 0.8,
            },
            colors: ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000'],
            tooltip:{
                custom: function({series, seriesIndex, dataPointIndex, w}) {
                    return (`<div class='nes-container'
                        <div>
                        <p>Rank: ${self.props.meta[seriesIndex].teams[dataPointIndex].rank}</p>
                        <p>Cluster Size: ${self.props.meta[seriesIndex].count}</p>
                        <div style='display:flex'><p>Cluster</p> ${Object.keys(self.props.meta[seriesIndex].types).reduce((prev, curr)=>{return prev + '<div style=' + self.typeStyle + '><img src="assets/types/'+ curr.toUpperCase() +'.png"/><p>'+ self.props.meta[seriesIndex].types[curr] +'</p></div>'},'')}</div>
                        ${Object.keys(self.props.meta[seriesIndex].teams[dataPointIndex].pokemons).reduce((prev, curr)=>{return prev + '<img src=' + `"${CDN_URL}${PokemonFactory.createPokemonFromName(curr).index.replace('-','/')}/${Emotion.NORMAL}.png"` + '/>'},'')}
                        </div>
                    </div>`)
                }
            }
        };
    }

    
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    render() {

        let series = [];
        this.props.meta.forEach(team=>{
            let data = [];
            team.teams.forEach(t=>{
                data.push({
                    x: t.x,
                    y: t.y,
                    z: 10,
                });
            });

            let name = '';
            let types = Object.keys(team.types).sort((a,b)=>{return team.types[b] - team.types[a]});
            if(types[0]){
                name += this.capitalizeFirstLetter(types[0]) + ' ' + team.types[types[0]] + '/'
            }
            if(types[1]){
                name += this.capitalizeFirstLetter(types[1]) + ' ' + team.types[types[1]]
            }
            series.push({
                name: name,
                data: data
            });
        });
        
        return (
            <div id="chart" style={{backgroundColor:'rgba(255,255,255,1)', border:'4px solid'}}>
                <Chart options={this.options} series={series} type="bubble" height={700} />
            </div>)
        }
}

export default Discover;