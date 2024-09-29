import TrackPlayer, { AppKilledPlaybackBehavior } from "react-native-track-player";
import SongQueue from './Queue'
import { getSongSrc } from "../networkRequest/songSrc";

class PlayerManagement {
    constructor() {
        this.queue = new SongQueue();
        console.log("PlayerManagement constructor called");
    }
    

    addSongsToQueue(songs) {
        songs.forEach(song => this.queue.addSong(song));
    }
    getQueueLength(){
        return this.queue.getQueueLength();
    }
   particularIndexSong(index){
  
    return this.queue.getSongOfParticularIndex(index);
   }

    async setupPlayer() {
        try {
            await TrackPlayer.setupPlayer({
                autoHandleInterruptions: true,
            });
            console.log("Player setup complete");
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

    async skipToNext() {
        const nextSong = this.queue.getNextSong();
        if (nextSong) {
            this.setCurrentSong(nextSong);
            await this.fetchSongAndPlay(nextSong);
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

