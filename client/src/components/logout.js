import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

export default function Logout(props) {
    useEffect(()=>{localStorage.removeItem("authToken")
    props.handler();
    ;},[])
//   console.log(props);
//   //  window.location.reload();
//   localStorage.removeItem("authToken");
//  
return <Redirect to="/" />;
  
}