import logo from '../../assets/shoponaire_noBg__sm.png';



export function StaticLoading () {

    return (
        <div className=' min-vh-100 bg__light justify-content-center align-content-center text-center'>
            <figure>
                <img src={logo} height={60} />
            </figure>
            <div className='text-center'><span className="loading-dots"></span></div>
        </div>
    )

}


