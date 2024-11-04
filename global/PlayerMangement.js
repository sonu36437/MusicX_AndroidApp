import TrackPlayer, { Capability ,Event} from "react-native-track-player";
import SongQueue from './Queue'
import { getSongSrc } from "../networkRequest/songSrc";
import { loadMore } from "../networkRequest/loadMore";
import * as FileSystem from 'react-native-fs';

class PlayerManagement {
    constructor() {
        this.queue = new SongQueue();
        this.fetchMoreUrl = "";
        this.cacheDir = `${FileSystem.CachesDirectoryPath}/songs`;
        this.createCacheDirectory();
        this.currentjobId=null;

        console.log("PlayerManagement constructor called");
    }

    async createCacheDirectory() {
        try {
            await FileSystem.mkdir(this.cacheDir, { intermediates: true });
            console.log('Cache directory created');
        } catch (error) {
            console.error('Error creating cache directory:', error);
        }
    }

    addSongsToQueue(songs, index) {
        console.log(this.fetchMoreUrl);
        this.queue.addSong(songs, index);
    }

    async destroyPlayer() {
        await TrackPlayer.pause();
        await TrackPlayer.reset();
    }

    getQueueLength() {
        return this.queue.getQueueLength();
    }

    particularIndexSong(index) {
        return this.queue.getSongOfParticularIndex(index);
    }

    async setupPlayer() {
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
                compactCapabilities: [Capability.Play, Capability.Pause],
            });
            console.log("Player setup complete");
        } catch (error) {
            console.error("Error setting up TrackPlayer:", error);
        }
    }

    async fetchSongAndPlay(song) {
        if (this.queue.getCurrentSong()?.id === song?.id) {
            console.log('Already playing this song');
            console.log("song: ", song);
            console.log("current playing song: ", this.queue.getCurrentSong());
            return;
        }
        if(this.currentjobId!==null){
            console.log('Cancelling previous download...');
            try {
                await FileSystem.stopDownload(this.currentjobId); 
                console.log('Previous download cancelled.');
            } catch (error) {
                console.error('Error cancelling download:', error);
            }
        }
        this.setCurrentSong(song);


        const fileName = `${song.id}.mp3`;
        const filePath = `${this.cacheDir}/${fileName}`;
        const metaFilePath = `${this.cacheDir}/${song.id}.meta`;
        let isFullyCached = false;

        try {
            const metaData = await FileSystem.readFile(metaFilePath, 'utf8');
            isFullyCached = JSON.parse(metaData).isComplete;
        } catch (error) {

        }

        if (isFullyCached) {
            console.log('Using fully cached song');
            console.log(filePath);
            await this.playSong(filePath, song);
        } else {
            console.log('Streaming and caching song simultaneously');
            const songSrc = await getSongSrc(song.title + " " + song.artists);
            const streamUrl = songSrc[songSrc.length - 1].url;

            await this.streamAndCacheSimultaneously(streamUrl, filePath, metaFilePath, song);
        }
    }

    async playSong(url, song) {
        const track = {
            ...song,
            url: url.startsWith('file://') ? url : `file://${url}`
        };
        await TrackPlayer.reset();
        await TrackPlayer.add(track);
        await TrackPlayer.play().then(()=>{console.log('Song playing')});
         TrackPlayer.addEventListener(Event.PlaybackError, async (error) => {
            console.log('Error playing song:', error);
            TrackPlayer.getProgress().then(progress=>{
                console.log(progress.buffered);
                TrackPlayer.seekTo(progress.buffered).then(async()=>{
                    // await  TrackPlayer.pause();
                    await TrackPlayer.play();

                })
                
            })
            
           
         }) 
    }

    async streamAndCacheSimultaneously(streamUrl, filePath, metaFilePath, song) {
        try {


            const { promise, jobId } = FileSystem.downloadFile({
                fromUrl: streamUrl,
                toFile: filePath,
                begin: (res) => {
                    console.log('Began streaming and caching');
                    this.updateMetaFile(metaFilePath, song.id, false, 0);
                },
                progress: (res) => {
                    const percentage = (res.bytesWritten / res.contentLength) * 100;
                    // console.log(`Caching progress: ${percentage.toFixed(2)}%`);
                    this.updateMetaFile(metaFilePath, song.id, false, percentage);
                }
            });


  

            console.log('Playing song while caching');
            this.currentjobId = jobId;
            await this.playSong(`file://${filePath}`, song);


            await promise;
            console.log('Song fully cached');
            await this.updateMetaFile(metaFilePath, song.id, true, 100);
            this.currentjobId=null;

        } catch (error) {
            console.error('Error during streaming and caching:', error);


            try {
                await FileSystem.unlink(filePath);
                await FileSystem.unlink(metaFilePath);
            } catch (cleanupError) {
                console.error('Error during cleanup:', cleanupError);
            }


            await this.playSong(streamUrl, song);
        }
    }


    async updateMetaFile(metaFilePath, songId, isComplete, percentage) {
        const metaData = JSON.stringify({
            songId,
            isComplete,
            percentage,
            lastUpdated: new Date().toISOString()
        });
        try {
            await FileSystem.writeFile(metaFilePath, metaData, 'utf8');
        } catch (error) {
            console.error('Error updating meta file:', error);
        }
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
        console.log(this.queue.getQueueLength());
        console.log(this.fetchMoreUrl);

        if (nextSong) {
            // this.setCurrentSong(nextSong);
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

    clearQueue() {
        this.queue.clearQueue();
    }
}

const playerManagement = new PlayerManagement();
export default playerManagement;