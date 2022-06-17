import { ApexOptions } from 'apexcharts'
import Chart from 'react-apexcharts'
import { useAppSelector } from '../../../hooks'
import React, { useState } from 'react'
import { CDN_PORTRAIT_URL } from '../../../../../types'
import MultiRangeSlider from 'multi-range-slider-react'

const maxEloValue = 1700

export default function BotReport(){
    const botMonitor = useAppSelector(state=>state.lobby.botMonitor)
    const [minValue, set_minValue] = useState(1200)
    const [maxValue, set_maxValue] = useState(1400)

    const handleInput = (e) => {
        set_minValue(e.minValue)
        set_maxValue(e.maxValue)
    }
    
    
    const botSeries: ApexAxisChartSeries = []
    botMonitor.forEach(b=>{
        const data: [number, number][] = []
        const e = b.data[b.data.length -1].elo
        if(e > minValue && e < maxValue){
            b.data.forEach(d=>{data.push([d.time, d.elo])})
            botSeries.push({name: b.name, data: data})
        }
    })

    const options: ApexOptions = {
        chart: {
            foreColor:'#ffffff',
            id: 'bot-report',
            zoom: {
                enabled: true
            }
        },
        colors: ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000'],
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 4,
        },
        stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            width: 2,
            dashArray: 0,      
        },        
        yaxis: {
            labels: {
            offsetX: 0,
            },
            axisBorder: {
            show: false
            },
            axisTicks: {
            show: false
            }
        },
        xaxis: {
            type: 'datetime',
            labels: {
            rotateAlways: true,
            formatter: function(val, timestamp) {
                if(timestamp){
                    return formatDate(timestamp)
                }
                else{
                    return ''
                }
            }
            }
        },
        legend: {
            fontFamily: 'Press Start 2P'
        },
        tooltip:{
            theme:'dark'
        }
    }
    return <div style={{backgroundColor:'#54596b', padding:'20px'}} className='nes-container'>
        <MultiRangeSlider
			min={0}
			max={maxEloValue}
			step={10}
			ruler={false}
			label={false}
			preventWheel={false}
			minValue={minValue}
			maxValue={maxValue}
			onInput={(e) => {
				handleInput(e)
			}}
            baseClassName='multi-range-slider multi-range'
		/>
        <div style={{height: '30px'}}>
            {botMonitor.map(b=><div style={{position: 'absolute', left:`${b.data[b.data.length -1].elo * 100 / maxEloValue}%`}} key={b.avatar}><img style={{width:'40px',height:'40px'}} src={`${CDN_PORTRAIT_URL}${b.avatar}.png`}/></div>)}
        </div>
        <Chart options={options} series={botSeries} height={600} />
    </div>
}

function pad(number: number) {
    if ( number < 10 ) {
        return '0' + number
        }
    return number
}


function formatDate(n: number) {
    const date = new Date(n)
    return  pad( date.getMonth() + 1 ) +
        '/' + pad( date.getDate() ) +
        ' ' + pad( date.getHours() ) +
        ':' + pad( date.getMinutes() )
}