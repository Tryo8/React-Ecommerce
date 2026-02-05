import { useState } from 'react'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import './styles/bgColors.scss';
import './styles/textColor.scss'; 
import './styles/buttons.scss';  
import './styles/textSizes.scss';  
import './styles/components.scss';  
import './styles/affects.scss';  
import 'rc-rate/assets/index.css';
import './App.css'
import AppRoutes from './AppRoutes';

import { Toaster, toast } from 'sonner';


function App() {


  return (

    
    <>
      <Toaster richColors  position="top-center"  />
      <AppRoutes/>
      {/* <nav className="navbar sticky-bottom bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Sticky bottom</a>
        </div>
      </nav> */}

    </>
  )
}

export default App
