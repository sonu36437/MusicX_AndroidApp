import React,{createContext,useContext, useEffect,useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


const AuthContext = createContext();

export function AuthContextProvider({children}){
    const [authToken,setAuthToken] = useState(null);

    useEffect(() => {
        const loadToken=async()=>{
            const token= await AsyncStorage.getItem('sp_dc');
            setAuthToken(token);
            console.log("from useEffect of AuthContext",token);
            


        }
        loadToken()
        
    },[])
    function saveAuthToken(token){
        setAuthToken(token);
        console.log("from saveAuthToken of AuthContext",token);
        AsyncStorage.setItem('sp_dc',token);
    }
    function logOut(){
        setAuthToken(null);
        AsyncStorage.removeItem('sp_dc');
    }


    return(
        <AuthContext.Provider value={{authToken,saveAuthToken,logOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext);
}

export default AuthContext;