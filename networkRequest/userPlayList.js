import axios from "axios";
import { fetchTracks } from "./spotifyRequest"
class Playlist{
    constructor(){
        this.userPlaylists=[]
        
    }
    createPlayist(PlaylistName){

    }
    async getUserPlaylist(url){
        try {
            const response = await fetchTracks(url || "https://api.spotify.com/v1/me/playlists?offset=0&limit=50");
            if (!response || !response.items) {
                throw new Error('Invalid response format');
            }

            const formattedList = response.items.map((item) => ({
                name: item.name,
                playlistId: item.id,
                tracks: item.tracks.href,
                
                images: item?.images==null?[""]:item?.images,
                totalItems: item.tracks.total,
            
            }));

            this.userPlaylists = formattedList; 
            return { data: formattedList }; 
        } catch (error) {
            console.error('Error fetching playlists:', error);
            throw error; 
        }
    }
    // getUserPlaylistItems(playlistId){

    // }
     async getPlayListItem(songUrl,limit ,offset){
      try{
        const response = await fetchTracks(songUrl);

     
        return response;
      
      }
      catch(e){
        console.log(e);
        

      }

    }


}
const UserPlaylists= new Playlist();
export default UserPlaylists;