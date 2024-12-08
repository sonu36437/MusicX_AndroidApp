import React, { createContext, useState } from'react';
export const PopupContext=createContext();
export const PopupContextProvider=({children})=>{
  const [popup,setPopup]=useState(false);
  const [popupContent,setPopupContent]=useState({});
  return (
    <PopupContext.Provider value={{popup,setPopup,popupContent,setPopupContent}}>
      {children} 
    </PopupContext.Provider>
  )
}
