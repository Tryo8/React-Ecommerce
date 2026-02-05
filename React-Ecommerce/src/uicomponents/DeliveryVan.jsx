import van from '../assets/images/van/van-frame.png';
import wheel from '../assets/images/van/wheel_test.png';
import cloud from '../assets/images/van/cloud.png';
import lightPole from '../assets/images/van/light-pole.png';


function DeliveryVan () {


    return(
        <div className='d-flex justify-content-center align-content-end'>
            <div className='d-flex dlivery__van position-relative justify-content-center align-content-end p-3 rounded-4'>
                <img src={cloud} alt="cloud" className='cloud'/>
                <div className='position-relative'>
                    <img src={van} alt="van" className='van'/>
                    <img src={wheel} alt='wheel' className='wheel_1'/>
                    <img src={wheel} alt='wheel' className='wheel_2'/>
                </div>
                 <img src={lightPole} alt='wheel' className='pole'/>
                <div className='ground'></div>
            
            </div>
        </div>
    )
}



export default DeliveryVan