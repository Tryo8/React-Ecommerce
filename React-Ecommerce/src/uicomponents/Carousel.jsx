

import img_one from '../assets/images/carsoualImg1.jpg';

function Carousel () {


    return(
        <div id="carouselExampleCaptions" className="carousel slide"  data-bs-ride="carousel">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
            </div>
            <div  className="carousel-inner rounded-4">
                <div className="carousel-item active position-relative" data-bs-interval="5000">
                    <img style={{height:'22rem'}} src={"https://images.pexels.com/photos/29502365/pexels-photo-29502365.jpeg"} 
                    className="d-block w-100 object-fit-cover rounded-4 shadow-sm border  img-fluid" alt="..."/>
                    <div className="carousel-caption">
                      
                    </div>
                </div>
                <div className="carousel-item">
                    <img style={{height:'22rem'}} src="https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg" className="d-block w-100 object-fit-cover" alt="..."/>
                    <div className="carousel-caption content d-none d-md-block">
            
                    </div>
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    )
}



export default Carousel