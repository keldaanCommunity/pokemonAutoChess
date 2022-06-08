export default function GameLife(props:{life:number}){
    return <div className='nes-container' style={{backgroundColor:'#54596b', padding:'.001px', display:'flex', width:'100px', height:'100%',  backgroundImage:'url("assets/ui/heart-bg.png"', backgroundSize:'cover'}}>
    <div style={{ background:'#54596b', display:'flex', alignItems:'center', borderRadius:'7px', height:'100%'}}>
        <h4 style={{marginLeft:'5px'}}>{props.life}</h4>
        <img style={{width:'25px', height:'25px', marginBottom:'5px'}} src={'assets/ui/heart.png'}/>
    </div>
</div>
}