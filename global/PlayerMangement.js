import TrackPlayer, { Capability,Event} from "react-native-track-player";
import SongQueue from './Queue'
import { getSongSrc } from "../networkRequest/songSrc";
import { loadMore } from "../networkRequest/loadMore";

class PlayerManagement {
    constructor() {
        this.queue = new SongQueue();
        this.playingFrom="";
        this.fetchMoreUrl="";
        this.playerReady=false;
        console.log("PlayerManagement constructor called");
    }
    
    addSongsToQueue(songs,index) {
       console.log(this.fetchMoreUrl);
        this.queue.addSong(songs,index);
       
    }
   async destroyPlayer(){
    await TrackPlayer.pause();
    await TrackPlayer.reset();

        
    }
    getQueueLength(){
        return this.queue.getQueueLength();
    }
   particularIndexSong(index){
  
    return this.queue.getSongOfParticularIndex(index);
   }

    async setupPlayer() {
        if(this.playerReady) {
            console.log("player is already setuppp done"); return ;
        };
        try {
            await TrackPlayer.setupPlayer({
                autoHandleInterruptions: true,
                maxCacheSize:1024*100,
                waitForBuffer: true,
            });
            
            TrackPlayer.updateOptions({
                // Media controls capabilities
                capabilities: [
                    Capability.Play,
                    Capability.Pause,
                    Capability.SkipToNext,
                    Capability.SkipToPrevious,
                    Capability.Stop,
                    Capability.SeekTo
                    
                ],
                color:3,
            
                // Capabilities that will show up when the notification is in the compact form on Android
                compactCapabilities: [Capability.Play, Capability.Pause,Capability.SkipToNext,Capability.SkipToPrevious],
            
               
            });
            console.log("Player setup complete");
            this.playerReady=true;
        } catch (error) {
            console.error("Error setting up TrackPlayer:", error);
            // You might want to handle the error further, depending on your app's needs
        }
    } 

    async fetchSongAndPlay(song) {

       
        const songScr=await getSongSrc(song.title+" "+song.artists);
        const track_with_url = {
            ...song, url: songScr[songScr.length - 1].url
          }
       await TrackPlayer.reset();
       await TrackPlayer.add(track_with_url);
       await TrackPlayer.play();


      
        

      
    }

    getCurrentSong() {
        return this.queue.getCurrentSong();
    }

    setCurrentSong(song){
        this.queue.setCurrentSong(song); 
    }
    setCurrentSongIndex(index){
        this.queue.currentIndex=index;
    }
     formatTracks = (tracksData) => {
      
        const tracks = tracksData.items ? tracksData.items.map(item => item.track) : tracksData.tracks.item;
      
        return tracks.map((track) => {
        
          const trackData = track.track || track;
      
          return {
            id: trackData.id,
            title: trackData.name,
            artist: trackData.artists?.map((artist) => artist.name).join(', ') || 'Unknown Artist',
            artists: trackData.artists?.[0]?.name || 'Unknown Artist',
            artwork: trackData.album?.images[0]?.url || '',
          
          };
        });
      };

    async skipToNext() {
        const nextSong = this.queue.getNextSong();
        console.log(this.queue.getQueueLength())
        console.log(this.fetchMoreUrl);

        //https://api.spotify.com/v1/me/tracks?
     
        if (nextSong) {
            this.setCurrentSong(nextSong);
            await this.fetchSongAndPlay(nextSong);
        }
        if(this.queue.getCurrentIndex()>=this.queue.getQueueLength()-10){
        
            const url=`${this.fetchMoreUrl}offset=${this.queue.getQueueLength()}&limit=20`;
           const songs=await loadMore(url);
           const data=this.formatTracks(songs);
      
         this.queue.addMoreSongs(data);
         
        }
    }

    async skipToPrevious() {
        const previousSong = this.queue.getPreviousSong();
        if (previousSong) {
            this.setCurrentSong(previousSong);
            await this.fetchSongAndPlay(previousSong);
        }
    }

    getQueueLength() {
        return this.queue.getQueueLength();
    }

    clearQueue() {
        this.queue.clearQueue();
    }
}

const playerManagement = new PlayerManagement();
export default playerManagement;

