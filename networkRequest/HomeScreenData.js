import axios from "axios";
import { fetchTracks } from "./spotifyRequest";

class HomeData{
async getUserTopSongs(offset=0,limit=20){
  console.log("hleeow top songs");
  
  // const res=await fetchTracks(`https://api.spotify.com/v1/me/top/tracks`)
  // console.log(res);
  const response = await axios("https://api.spotify.com/v1/me/top/tracks",{
    
  });

  
  // const data=res.items.map((ele)=>{
  //   return ele.name;
    

  // })
  // return data;

 }
 async getNewTracks(){
    const url=`https://api.spotify.com/v1/search?q=${encodeURI("new Release")}&type=track&limit=50`
    const res=await fetchTracks(url);
  
    
    const data= res.tracks.items.map((ele)=>{
   
    return ele;
        

    })
    
 
    
    return data;

 }
}
const Homedata=new HomeData();
export default Homedata;