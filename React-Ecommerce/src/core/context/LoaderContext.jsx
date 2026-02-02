import { useContext, createContext, useState } from "react";

export const LoadingContext = createContext();

export function LoadingContextProvider ({children }) {

    const [loading, setLoading] = useState(false);



    return(
        <LoadingContext.Provider value={{ loading, setLoading}}>
            { children}
        </LoadingContext.Provider>
    ) 
}


export default LoadingContextProvider