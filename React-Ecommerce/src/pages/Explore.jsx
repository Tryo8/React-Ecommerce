import { Products } from "../components/Products"
import Carousel from "../uicomponents/Carousel"
import { Categories } from "../components/Categories"

function Explore () {

  return(
    <>
      <div className="container my-3">
  
        <Categories/>
  
        <Carousel/>
  
        <div className="my-2 txt__s text-danger">HOT SALE<i className="bi bi-fire"></i></div>
        <Products/>
      </div>
    </>
  )
}

export default Explore