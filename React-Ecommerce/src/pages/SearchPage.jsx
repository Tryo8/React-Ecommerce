import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useContext } from "react";
import signal from '../assets/images/signal.png';
import { EmptyState, ErrorState } from "../core/placeholders/PlaceHolders";
import searchImg from '../assets/images/empty-search.png';
import img from '../assets/images/photo.png';
import { useQuery } from "@tanstack/react-query";
import { searchProductsQuery } from "../core/queryOptions/queries";
import { LoadingContext } from "../core/context/LoaderContext";
import { errorToast } from "../core/utils/errorToast";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const { setLoading } = useContext(LoadingContext);
  const navigate = useNavigate();
  const { data: results = [],isLoading, isPending, isError, refetch} = useQuery(searchProductsQuery(query));

  useEffect(() => {
    setLoading(isLoading);
  },[isLoading])

  if (!query) return <EmptyState customImg={searchImg} btnText={'Go Back'} navRoute={-1} message={"Please enter a query"}/>
  if (isError){
    errorToast(isError)
    return <ErrorState customImg={signal} message={"Oops something went wrong, Try again later"}/>;
  }

  return (
    <div className="container">
    <p className="text-center text-muted txt__s">Search results for"{query}"</p>
      <div className="row px-2 my-3">
        { 
          results.length === 0 ? 
          (<EmptyState customImg={searchImg} btnText={'Go Back'} navRoute={-1} message={"Sorry, We could not find any results"}/>) 
          : 
          (
            results.map((product) => 
              <div key={product?.product_id} style={{height:'22rem', perspective:" 1000px"}} className="col-6 col-md-5 col-sm-6  col-lg-3 p-1 rounded-4" >
                <div onClick={() => navigate(`/user/product/${product?.product_uuid}`)} className="card shadow-sm bg__light card__product border-0 rounded-4 h-100">
                  <img 
                  onError={(e) => {e.target.onerror = null; e.target.src = img}}
                   height={160} width={160} 
                   className="card-img-top rounded-top-4 object-fit-cover" 
                   src={product?.product_img || img} alt="product display image"/>
                  <div className="card-body p-3">
                    <h5 className="text-truncate">{ product?.name || "N/A"}</h5>
                    <p style={{height:'3rem'}} className="mb-0 truncate-2 text-secondary txt__s">{ product?.description || "N.A"}</p>
                    <small>{ product?.category}</small>
                  </div>
                  <div className="d-flex mt-auto px-3 pb-3 align-items-center">
                    {
                      product?.price === 0 ? <span className="text-success">FREE</span>
                      :
                      <span className="text___blue"><b className=" fw-light fs-5">$</b>{product?.price || "N/A"}</span>
                    }
                  </div>
                </div>
              </div>
            )
          )
        }
      </div>
    </div>
  );
}

export default SearchPage;
