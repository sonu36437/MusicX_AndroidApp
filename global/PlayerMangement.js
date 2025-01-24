import TrackPlayer, { Capability, Event } from "react-native-track-player";
import SongQueue from './Queue'
import { getSongSrc } from "../networkRequest/songSrc";
import { loadMore } from "../networkRequest/loadMore";
import RNFS from 'react-native-fs'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, LogBox } from "react-native";
import { getRecommendTracks, saveUserListeningActivity } from "./saveuserlistningData";
import Homedata from "../networkRequest/HomeScreenData";


class PlayerManagement {
    constructor() {
        this.queue = new SongQueue();
        this.playingFrom = "";
        this.fetchMoreUrl = "";
        this.playerReady = false;
        console.log("PlayerManagement constructor called");
    }


    addSongsToQueue(songs, index) {// index is here which song is clicked
        console.log(this.fetchMoreUrl);
        this.queue.addSong(songs, index);

    }
    async fetchFromLocalIfAvilable(songid) {
        console.log(songid);



        try {
            const downloadLocation = `${RNFS.DocumentDirectoryPath}/downloads`;
            const files = await RNFS.readDir(downloadLocation);


            const metadataFiles = files.filter(file => file.name.endsWith('_metadata.json'));




            for (const metadataFile of metadataFiles) {
                const metadata = await RNFS.readFile(metadataFile.path, 'utf8');
                const parsedMetadata = JSON.parse(metadata);

                if (parsedMetadata.id === songid) {


                  
                    const audioFileName = metadataFile.name.replace('_metadata.json', '.mp4');
                    const audioFilePath = `${downloadLocation}/${audioFileName}`;
                    console.log(audioFilePath);



                    const exists = await RNFS.exists(audioFilePath);
                    if (exists) {

                   

                        return {
                            found: true,
                            path: `file://${audioFilePath}`,

                        };
                    }
                }
            }

            // Song not found locally
            return { found: false };
        } catch (error) {
            console.error('Error checking local files:', error);
            return { found: false, error };
        }
    }
    async destroyPlayer() {
        await TrackPlayer.pause();
        await TrackPlayer.reset();


    }
    getQueueLength() {
        return this.queue.getQueueLength();
    }
    getTracksInQueue() {
        return this.queue;
    }
    particularIndexSong(index) {

        return this.queue.getSongOfParticularIndex(index);
    }

    async setupPlayer() {
        if (this.playerReady) {
            console.log("player is already setuppp done"); return;
        };
        try {
            await TrackPlayer.setupPlayer({
                autoHandleInterruptions: true,
                maxCacheSize: 1024 * 100,
                waitForBuffer: true,
            });

            TrackPlayer.updateOptions({

                capabilities: [
                    Capability.Play,
                    Capability.Pause,
                    Capability.SkipToNext,
                    Capability.SkipToPrevious,
                    Capability.Stop,
                    Capability.SeekTo

                ],
                color: 3,


                compactCapabilities: [Capability.Play, Capability.Pause, Capability.SkipToNext, Capability.SkipToPrevious],


            });
            console.log("Player setup complete");
            this.playerReady = true;
        } catch (error) {
            console.error("Error setting up TrackPlayer:", error);

        }
    }

    async fetchSongAndPlay(song) {
        console.log("song for fething,",song);
        
     
        const local = await this.fetchFromLocalIfAvilable(song.id)
        console.log(local.path);










        const songScr = local.found ? local.path : await getSongSrc(song.title + " " + song.artists);
        const track_with_url = {
            ...song, url: local.found ? songScr : songScr[songScr.length - 1].url
        }
        //here the array is present to create an array and save the in asyncStorage to 
        //user listning behevior and to recommend song
        //at most only 10 artist will be saved if exceed 10 and start removeing from the front 


        await TrackPlayer.reset();
        await TrackPlayer.add(track_with_url);
        await TrackPlayer.play();
       await saveUserListeningActivity(song)

    }
    async playSingle(song) {
        this.fetchSongAndPlay(song);

    }


    getCurrentSong() {
        return this.queue.getCurrentSong();
    }

    setCurrentSong(song) {
        this.queue.setCurrentSong(song);
    }
    setCurrentSongIndex(index) {
        this.queue.currentIndex = index;
    }
    formatTracks = (tracksData) => {
     

        const tracks = tracksData.items ? tracksData.items.map(item => item.track) : tracksData.tracks.item ||tracksData;

        return tracks.map((track) => {

            const trackData = track.track || track;
       
            

            return {
                id: trackData.id,
                title: trackData.name||trackData.title,
                artist: trackData.artists?.map((artist) => artist.name).join(', ') || trackData.artist||'Unknown Artist',
                artists: trackData.artists?.[0]?.name || 'Unknown Artist',
                artwork: trackData.album?.images[0]?.url || '',

            };
        });
    };

    async skipToNext() {
        const nextSong = this.queue.getNextSong();
        console.log(this.playingFrom);
        // if(this.playingFrom==='search' || this.playingFrom==="home"){
        //     const artist= await Homedata.getUserSavedArtists();
        //     console.log("here artist are: ",artist);
            
        //     const response=await getRecommendTracks(artist)
        //     console.log(response);
            
            
            
            

            
        // }
    
        
        console.log(this.queue.getQueueLength())
        console.log(this.fetchMoreUrl);
        if (this.queue.getQueueLength() <= 0) {
            return;
        }



        if (nextSong) {
            this.setCurrentSong(nextSong);
            await this.fetchSongAndPlay(nextSong);
        }
        if (this.queue.getCurrentIndex() >= this.queue.getQueueLength() - 10) {

            const url = `${this.fetchMoreUrl}offset=${this.queue.getQueueLength()}&limit=20`;
            const songs = await loadMore(url);
            const data = this.formatTracks(songs);
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

