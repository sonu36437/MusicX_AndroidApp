class SongQueue{
    constructor(){
        this.queue = [];
        this.currentIndex = -1;
        this.currentSong=null;  
    }

    addSong(song){
        this.queue.push(song);
    }
    clearQueue(){
        this.queue = [];
        this.currentIndex = -1;
    }
    getCurrentSong(){
        return this.currentSong;
    }
    setCurrentSong(song){
        this.currentSong = song;
    }
    getNextSong(){
        if(this.queue.length>0){
            this.currentIndex = (this.currentIndex+1)%this.queue.length;
            return this.queue[this.currentIndex];
        }
        return null;
    }
    getPreviousSong(){
        if(this.queue.length>0){
            this.currentIndex = (this.currentIndex-1+this.queue.length)%this.queue.length;
            return this.queue[this.currentIndex];
        }
        return null;
    }
    getCurrentIndex(){
        return this.currentIndex;
    }
    setCurrentIndex(index){
        this.currentIndex = index;
    }
    getSongOfParticularIndex(index){
       return this.queue[index];
    
 
    }
    getQueueLength(){
        return this.queue.length;
    }

}
export default SongQueue;