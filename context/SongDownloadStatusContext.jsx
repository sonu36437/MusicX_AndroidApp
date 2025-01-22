import { View, Text } from 'react-native'
import React,{createContext,useContext, useState} from 'react'
export const DownloadContext=createContext();

export default function DownloadContextProvider({children}) {
    const [songChange,setSongChange]=useState(false);
  return (
    <DownloadContext.Provider value={{songChange,setSongChange}}>
        {children}
    </DownloadContext.Provider>
   
  )
}
/// not need i am lazy to delete 