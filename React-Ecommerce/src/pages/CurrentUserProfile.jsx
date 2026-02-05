import { useContext, useState,useEffect } from "react"
import { UserContext } from "../core/context/UserContext"
import userDefault from '../assets/images/userDefault.png';
import { miAxios } from "../core/axios/axios";
import { useAuth } from "../core/context/AuthContext";
import { toast } from "sonner";
import { errorToast } from "../core/utils/errorToast";
import { useLogout } from "../core/hooks/useLogout";
import PopoverSm from "../uicomponents/PopoverSm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Avatar from "../uicomponents/Avatar";
import { decode } from "@msgpack/msgpack";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import axios from "axios";
import useAxiosPrivate from "../core/hooks/useAxiosPrivate";
import { Link } from "react-router-dom";
import cloundImg from '../assets/images/cloud-connection.png'
function CurrentUserProfile () {

    const { user, wishList } = useContext(UserContext);
    const { auth } = useAuth();
    const [errors, setErrors] = useState("");
    const [geo, setGeo] = useState(null);
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    const [activeBtn, setActiveBtn] = useState(false);
    const [location, setLocation] = useState(null);
    const [openChangeLocation, setOpenChangeLocation] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const [ transactions, setTransactions] = useState([]);
    const logout = useLogout();
    const [address, setAddress] = useState({});
     const [userLocation, setUserLocation] = useState(null);

    const {
        house_number,
        house_name,
        road,
        neighbourhood,
        suburb,
        city_district,
        city,
        county,
        state,
        postcode,
        country,
    } = address || {};

    const handleSelectLocation = (loc) => {
        setLocation(loc);
    };


    const getAddressFromCoords = async (lat, lng) => {
        try {
            const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
            );
            const data = await res.json();

            setAddress(data.address)
            return data.address;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    useEffect(() => {
        if (user) {
            setEditUser({
                username: user.username ,
                email: user.email,
                address: user.address,
                country: user.country 
            });
        }
     
    }, [user]);

   

    const [editUser, setEditUser] = useState({
        username: user?.username ,
        email: user?.email,
        address: user?.address,
        country: user?.country
    });

    async function handleEditUser (e)  {
        e.preventDefault();
        setErrors("");
        if (!editUser.username.trim()) {
            setErrors("Username is required");
        }
        if (!editUser.email.trim()) {
            setErrors("Email is required");
            return;
        }
        if (!editUser.address.trim()) {
            setErrors("Address is required");
            return;
        }
        if (!editUser.country.trim()) {
            setErrors("Country is required");
            return;
        }

        try{
            const res = await miAxios.put(`/user/update-current-user`, editUser,   
                {
                    headers: {Authorization: `Bearer ${auth?.accessToken}`}
                });
                toast.success('Update successfully')
                setEditUser(res.data);
                queryClient.invalidateQueries(["user"]);
        }catch(err){
            errorToast(err);
            console.log(err)
        }
        
    }
    
    const { data, refetch} = useQuery({
        queryKey: ["transactions"],
        queryFn: async () => 
        {
            const res = await axiosPrivate.get(`/payments/get-payments`,
            {
                responseType: "arraybuffer",
            });
            console.log(res.data)
            const transactions = decode(new Uint8Array(res.data));
            setTransactions(transactions)
            return transactions;
        },
    });


    useEffect(() => {
        miAxios.get("/api/geo").then(res => {
            setGeo(res.data);
        })
    }, []);

    useEffect(() => {
        if (location) {
            getAddressFromCoords(location.lat, location.lng);
        } 
    },[location])

    const handleSaveUserLocation = async (e) => {
        e.preventDefault();

        if (!location) return toast.warning("Please select loaction");

        const { lat, lng } = location;

        
        if (lat == null || lng == null) {
            toast.warning("Please select valid loaction");
        }
        

        if (
            Number.isNaN(lat) || 
            Number.isNaN(lng) || 
            lat < -90 || lat > 90 || 
            lng < -180 || lng > 180
        ) {
            return toast.error("Invalid location coordinates!");
        }

        if (!address?.country && !address?.city) {
            return toast.warning("Please select a location within a valid area.");
        }
        
        try {
            await axiosPrivate.post('/user/add-user-location', {
                latitude: location.lat,
                longitude: location.lng,
                country: address.country || null,
                city: address.city || address.town || address.village || null,
                house_number: address.house_number || null,
                city_district: address.city_district || null,
                state: address.state || null,
                postcode: address.postcode || null,
                house_name: address.house_name || null,
                road: address.road || null,
                suburb: address.suburb || null,
                neighbourhood:  address.neighbourhood || null,
                label: 'Home'
            });
            toast.success("Location set successfully");
            setUpdateSuccess(true);
            queryClient.invalidateQueries({ queryKey: ["user-location"] });
        } catch (err) {
            errorToast(err)
        }
    };
    const getLocation = useQuery({
        queryKey: ["user-location"],
        queryFn: async () => {
        const res = await axiosPrivate.get("/user/get-location"); 
            if (res.data == null || undefined) {
                throw new Error("Location not found");
            }

            return res.data;
        },
    });

    const removeTransaction = useMutation({
        mutationFn: async (id) => {
            const res = await axiosPrivate.delete(`/payments/delete-transaction/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["transactions"]);
            toast.success("Removed Successfully");
        },
        onError: (err) => {
            errorToast(err, "Failed to remove from transactions, try again later")
        }
    });

    useEffect(() => {
        if (getLocation.data) {
            setUserLocation(getLocation.data);
        }
    }, [getLocation.data]);

    return(
        <div className="container my-4">

            <div className="card rounded-4 bg__light border-0 border-bottom">
                <div className="d-flex p-4 align-items-center">
                    <div className="p-1 text-end">
                        {
                            user?.user_img ? user?.user_img :  user?.avatar  ? 
                            <img 
                            className="rounded-circle main__user__img" 
                            height={100} 
                            width={100} 
                            src={user?.user_img ? user?.user_img :  user?.avatar || userDefault} 
                            onError={(e) => {e.target.onerror = null; e.target.src = userDefault}}
                            alt={"user-image"}/>
                            :
                            <Avatar className={"main__user__img"} name={user?.username} size={100} />

                        }
                    </div>

                    <div className="p-1 w-100">
                        <div className="d-flex">               
                            <h4 className="txt__blue">@{user?.username || "N/A"}</h4>
                        </div>
                        <p className="mb-0"><i className="bi bi-envelope txt__blue"></i> {user?.email || "Not Provided"}</p>
                        <p className="mb-0"><i className="bi bi-geo-alt txt__blue pe-1"></i> 
                            {userLocation?.country && <span>{userLocation?.country}, </span>}
                            {userLocation?.state && <span>{userLocation?.state}, </span>}
                            {userLocation?.city && <span>{userLocation?.city}, </span>}
                            {userLocation?.city_district && <span>{userLocation?.city_district}, </span>}
                            {userLocation?.county && <span><span className="text-dark-emphasis">County: </span>{userLocation?.county}, </span>}
                            {userLocation?.suburb && <span><span className="text-dark-emphasis">Area/Block: </span>{userLocation?.suburb}, </span>}
                            {userLocation?.road && <span>{userLocation?.road} </span>}
                        </p>
                    </div>
                </div>
            </div>
            <div className="card rounded-4 bg__light border-0 border-bottom p-4 my-4">
                <div className="d-flex justify-content-between gap-2">
                    <button className="btn__purple__grad" onClick={() => setOpenChangeLocation(prev => !prev)}><i className="bi bi-geo-alt"></i> Change Location</button>               
                       <div className="dropdown dropstart">
                            <button className="btn__circle ms-auto" type="button" data-bs-toggle="dropdown">
                            <i class="bi bi-three-dots-vertical"></i>
                            </button>
                            <ul className="dropdown-menu rounded-2">
                                <li data-bs-toggle="modal" data-bs-target="#editUserModal" className="dropdown-item">
                                    <i className="bi bi-person-gear"></i> Edit
                                </li>
                                <li>
                                    <Link className="dropdown-item" to={'/user/orders'}>
                                    <i class="bi bi-box-seam"></i> Orders</Link>
                                </li>
                                <li data-bs-toggle="modal" data-bs-target="#paymentsModal" className="dropdown-item">
                                    <i class="bi bi-stripe"></i> Payments
                                </li>
                                <li>
                                    <button className="dropdown-item text-danger" 
                                         data-bs-toggle="modal" data-bs-target="#logoutModal">
                                        <i className="bi bi-power"></i> Logout
                                    </button>
                                </li>
                            </ul>
                       </div>
                  
                </div>
            </div>

            {
                openChangeLocation ? 
                <div className="p-4 bg__light rounded-4 border-bottom">
                    <form onSubmit={handleSaveUserLocation}>
                        {
                            updateSuccess ?   
                            <div className="text-center text-white mb-2 bg__success p-1">
                            <i className="bi bi-check-circle"></i> Location  Updated</div> : null
                        }
                       
                        <Map onSelectLocation={handleSelectLocation} />
                        <div className="border p-3 gap-2 rounded-bottom-4 d-flex justify-content-end">
                            <button className="btn__white" type="button" onClick={() => setOpenChangeLocation(prev => !prev)}>Close</button>
                            <button className="btn__purple__grad" type="submit">Save Location</button>
                        </div>
                        <div className="p-3 rounded-4 border mt-3">
                            <p className="mb-0"><span className="text-secondary">Current Location: </span>
                                {userLocation?.country && <span>{userLocation?.country}, </span>}
                                {userLocation?.state && <span>{userLocation?.state}, </span>}
                                {userLocation?.city && <span>{userLocation?.city}, </span>}
                                {userLocation?.city_district && <span>{userLocation?.city_district}, </span>}
                                {userLocation?.county && <span><span className="text-dark-emphasis">County: </span>{userLocation?.county}, </span>}
                                {userLocation?.suburb && <span><span className="text-dark-emphasis">Area/Block: </span>{userLocation?.suburb}, </span>}
                                {userLocation?.road && <span><span className="text-dark-emphasis">Street: </span>{userLocation?.road}, </span>}
                            </p>
                        </div>
                        <div className="p-3 rounded-4 border mt-3 overflow-hidden position-relative">
                            <p className="mb-0"><span className="text-secondary">New Location: </span>
                                {country && <span>{country}, </span>}
                                {state && <span>{state}, </span>}
                                {city && <span>{city}, </span>}
                                {city_district && <span>{city_district}, </span>}
                                {county && <span><span className="text-dark-emphasis">County: </span>{county}, </span>}
                                {suburb && <span><span className="text-dark-emphasis">Area/Block: </span>{suburb}, </span>}
                                {road && <span><span className="text-dark-emphasis">Street: </span>{road}, </span>}
                            </p>
                        </div>
                        <div className="form-text txt__sm"><i class="bi bi-info-circle"></i> Your orders will be delivered to the current location</div>
                    </form>
                </div>
                :
                null
            }
   
            <PopoverSm id={"logout"} message={"Are You Want Logout?"} clickFn={() => logout.mutate()} type={"error"} />
            <div className="modal fade p-0" id="editUserModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="editUserModal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-4">
                        <div className="modal-header rounded-4">
                            <h1 className="modal-title fs-5" id="editUserModalLabel">Edit </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                         <form onSubmit={handleEditUser}>
                            <div className="modal-body">
                                <div className="text-danger text-center">{errors}</div>
                                <div className="mb-3">
                                    <label className=" form-label">Username</label>
                                    <input 
                                    value={editUser?.username || ""}
                                    onChange=
                                    {(e) => setEditUser(prev => ({...prev,username: e.target.value}))}
                                    className="form-control" type="text"  placeholder="Username"/>
                                </div>

                                <div className="mb-3">
                                    <label className=" form-label">Address</label>
                                    <input rows="3" 
                                    value={editUser?.address || ""}
                                    onChange=
                                    {(e) => setEditUser(prev => ({...prev,address: e.target.value}))}
                                    className="form-control" type="text"  placeholder="Address"/>
                                </div>
                    
                            </div>
                            <div className="modal-footer rounded-4">
                                <button type="button" className="btn__white" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn__blue__full" data-bs-dismiss="modal"> Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="modal fade p-0" id="paymentsModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="paymentsModal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-4">
                        <div className="modal-header rounded-4">
                            <h1 className="modal-title fs-5">Payments </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                         
                        <div className="modal-body overflow-scroll overflow-x-hidden p-0" style={{height:'18rem'}}>
                            {
                                transactions.length === 0 ? 
                                <div className="p-2">
                                    <div className="d-flex justify-content-center">
                                        <img height={80} src={cloundImg} alt="img"/>
                                    </div>
                                    <div className="text-center p-2 text-secondary">There are no payments records</div>
                                </div>:
                                <div class="table-responsive">
                                    <table class="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th className="text-start txt__sm fw-semibold text-dark"><i class="fa-solid fa-sack-dollar i__phone"></i> Total</th>
                                                <th className="text-center txt__sm fw-semibold text-dark"><i class="fa-solid fa-coins i__phone"></i> Method</th>
                                                <th className="text-center txt__sm fw-semibold text-dark"><i class="fa-regular fa-calendar i__phone"></i> Date</th>
                                                <th className="text-center txt__sm fw-semibold text-dark"><i class="fa-solid fa-xmark"></i></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            
                                            {
                                                transactions.map((t,index) => (
                                                    <tr key={index}>
            
                                                        <td className="text-success txt__sm">${t?.amount || "N/A"}</td>
                                                        <td className="text-center txt__sm">{t?.currency.toUpperCase() || "N/A"}/ {t?.payment_method || "N/A"}</td>
                                                        <td className="text-end txt__sm text-truncate text-dark-emphasis txt__phone">
                                                            {new Date(t?.created_at).toLocaleString()}
                                                        </td>
                                                        <td className="txt__xs text-center">
                                                        <span className="  border p-2 rounded-circle">
                                                            <i type="button" onClick={() => removeTransaction.mutate(t?.id)}  class="bi bi-trash3 text-danger"></i>
                                                        </span>
                                                    
                                                        </td>
                                                    
                                                    </tr>
                                                ))
                                            }
                                        
                                        </tbody>
                                    </table>
                                </div>
                            }

                        </div>
                        <div className="modal-footer rounded-4">
                            <button type="button" className="btn__white" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal" tabIndex="-1" id="logoutModal" aria-labelledby="modal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-4">
                        <div className="modal-body text-center">
                            <p className="fs-5 text-danger">
                            <i class="bi bi-exclamation-circle"></i> Are Sure You Want Logout?</p>
                            <small className="txt__sm text-muted">This action will sign you out.</small>
                        </div>
                        <div className="modal-footer rounded-4 pt-1">
                            <button type="button" className="btn__white" data-bs-dismiss="modal">Cancel</button>
                            <button onClick={() => logout.mutate()} data-bs-dismiss="modal" type="button" className="btn__red">Yes</button>    
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}


export default CurrentUserProfile