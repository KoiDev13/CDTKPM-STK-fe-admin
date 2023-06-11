import React, { useEffect } from 'react';

export default function Logout() {
    useEffect(()=>{
      window.location.assign('/login')
    })  
    return (
      <>
        
      </>
    );
  }