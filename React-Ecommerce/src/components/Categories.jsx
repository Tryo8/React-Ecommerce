import { useQuery } from "@tanstack/react-query";
import { categoriesQueryOptions } from "../core/queryOptions/queries";
import { useContext,useEffect, useState } from "react";
import { LoadingContext } from "../core/context/LoaderContext";
import { ErrorState } from "../core/placeholders/PlaceHolders";
import ecommerce from '../assets/images/ecommerce.png';
import { useNavigate } from "react-router-dom";
import tech from '../assets/images/categories/tech.jpg';
import sports from '../assets/images/categories/sports.jpg';




export function Categories ({ type, fn }) {
    const { setLoading } = useContext(LoadingContext);
    const { data: categories = [], isPending, isError, refetch} = useQuery(categoriesQueryOptions);
    const navigate = useNavigate();

    const categoryImgs = {
        tech: tech,
        sports: sports,
        DE: "germany",
        FR: "france",
        GB: "united-kingdom",
        IT: "italy",

    };

    useEffect(() => {
        setLoading(isPending);

    }, [isPending, setLoading]);

    if(isError) {
        return <ErrorState message={"Faild to load categories"} refetchFn={refetch}/>
    };

    return(
        <div className="row px-2 mb-3">
            {
                categories.length === 0 ? (''):
                (
                    categories.map((c) => (

                        <div key={c?.category} type="submit" 
                        onClick={() => navigate(`/user/products-categories/${c?.category}`)} style={{height:'150px', cursor:'pointer'}} 
                        className="col-6 col-sm-4 col-md-4 col-lg-2 p-1 rounded-4 position-relative">
                            <img  
                            loading="lazy"
                            src=
                            {
                                c.category === "tech" ? tech:
                                c.category === "electronics" ? "https://media.istockphoto.com/id/1196974664/photo/set-of-home-kitchen-appliances-in-the-room-on-the-wall-background.jpg?s=612x612&w=0&k=20&c=dUSAMg-LUh6j-4437kz30w8k7KgJiR8yrTTXhGiFh0s=":
                                c.category === "fashion" ? "https://media.istockphoto.com/id/2183222014/photo/a-stylish-young-man-poses-in-a-black-coat-and-yellow-beanie-against-a-backdrop.jpg?s=612x612&w=0&k=20&c=QHIIY2OAvNwhZWdfJDXtXRZw87At7_PvO6SkMHnTly4=":
                                c.category === "sports" ? sports:
                                c.category === "beauty" ? "https://media.istockphoto.com/id/2203167210/photo/luxurious-cosmetic-products-on-soft-pastel-pink-background-beauty-fashion-and-elegant-makeup.jpg?s=612x612&w=0&k=20&c=N-Ofh-K4J3pe6cfY22Uf_e6PmEUo1logyY2O_OZJm7I=":
                                c.category === "fitness" ? "https://media.istockphoto.com/id/2208288816/photo/female-kickboxer-shadowboxing-with-dumbbells.jpg?s=612x612&w=0&k=20&c=e7PHUg4jCCae2qqgRLG95FQyVB6otNK-B_zOenscRFI=":
                                ecommerce
                            } 
                            onError={(e) => {e.target.onerror = null; e.target.src = ecommerce}}
                            className="w-100 h-100 object-fit-cover rounded-4 shadow-sm border" alt={c.category}/>
                            <div className="position-absolute top-0 end-0 bg__transparent__gradient m-3 rounded-4 p-2 text-white fw-medium text-muted txt__s">
                                {c.category}
                            </div>
                        </div>

                    ))
                )

            }

        </div>
    )
    


}