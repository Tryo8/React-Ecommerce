import { Router, Route, Routes, Navigate } from "react-router-dom"
import UserLayout from "./layout/UserLayout"
import Explore from "./pages/Explore"
import NotFound from "./pages/NotFound"
import About from "./pages/About"
import { Product } from "./components/Product"
import { Cart } from "./pages/Cart"
import { SignIn } from "./pages/security/SignIn"
import { ProtectRoutes } from "./core/utils/ProtectRoutes"
import { AuthRoute } from "./core/utils/AuthRoutes"
import CurrentUserProfile from "./pages/CurrentUserProfile"
import SearchPage from "./pages/SearchPage"
import { TermsOfService } from "./pages/TermsOfService"
import { SignUp } from "./pages/security/SignUp"
import GithubSuccess from "./pages/security/GithubSecurity"
import { StaticLoading } from "./core/placeholders/StaticLoading"
import { ProductsByCategory } from "./components/ProductsByCategory"
import { User } from "./pages/User"
import WishList from "./pages/WishList"
import DiscountsPage from "./pages/Discounts"
import SuccessPage from "./pages/successAndCancel/SuccessPage"
import CancelPage from "./pages/successAndCancel/CancelPage"
import Orders from "./pages/Orders"


function AppRoutes () {

    return(

        <Routes>
            <Route path="/" element={<Navigate to="/user" replace />} />
            <Route path="/user" element={<UserLayout />}>
                <Route index element={<Navigate to="explore" replace />} />
                <Route path="explore" element={<Explore />} />
                <Route path="product/:uuid" element={<Product />} />
                <Route path="cart" element={<Cart />} />
                <Route path="about" element={<About />} />
                <Route element={<AuthRoute/>}>
                    <Route path="profile" element={<CurrentUserProfile/>} />
                </Route>
                <Route path="search" element={<SearchPage/>} />
                <Route path="user/:user_uuid/:productId" element={<User/>} />
                <Route path="terms-of-service" element={<TermsOfService/>} />
                <Route path="wish-list" element={<WishList/>} />
                  <Route path="orders" element={<Orders/>} />
                <Route path="discounts" element={<DiscountsPage/>} />
            
                     
                <Route path="products-categories/:category" element={<ProductsByCategory/>} />
            </Route>
      
            <Route element={<ProtectRoutes/>}>
                <Route path="/signIn" element={<SignIn/>} />
                <Route path="/signUp" element={<SignUp/>} />
                <Route path="/github-success" element={<GithubSuccess />} />
            </Route>
            <Route path="/cancel-payment" element={<CancelPage mainMessage="Payment Failed" smallMessage="Your payment was not successfull"/>} />
            <Route path="/success-payment" element={<SuccessPage mainMessage="Payment Success" smallMessage="Your payment was successfull"/>} />
            <Route path="*" element={<NotFound/>} />
        </Routes>

    )

}


export default AppRoutes