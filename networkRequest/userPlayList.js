import { fetchTracks } from "./spotifyRequest"
class Playlist{
    constructor(){
        this.userPlaylists=[]
        
    }
    createPlayist(PlaylistName){

    }
    async getUserPlaylist(url){
        const response = await fetchTracks(url||"https://api.spotify.com/v1/me/playlists?offset=0&limit=50")
        const formattedList=response.items.map((item)=>{
            return {
                name:item.name,
                tracks:item.tracks.href,
                images:item.images,
                totalItems:item.tracks.total,
                
                
              
            }
        })
        console.log(formattedList)
        
        

    }
    getUserPlaylistItems(playlistId){

    }


}
const UserPlaylists= new Playlist();
 export default UserPlaylists;