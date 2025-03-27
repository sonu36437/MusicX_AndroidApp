import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getSongSrc = async (query) => {
    console.log("Starting getSongSrc with query:", query);
    try {
       
        const cacheKey = query.trim();
        console.log("Checking cache for key:", cacheKey);
        
        const cachedSong = await AsyncStorage.getItem(cacheKey);
        // console.log("Cache result:", cachedSong);
        
        if (cachedSong) {
            console.log("Found cached song data");
            const { downloadUrl, timestamp } = JSON.parse(cachedSong);
            const now = Date.now();
            const tenDays = 10 * 24 * 60 * 60 * 1000;
            
            if (now - timestamp < tenDays) {
                console.log("Cache is still valid, returning cached URL");
                return downloadUrl;
            }
            
            console.log("Cache expired, removing old data");
            await AsyncStorage.removeItem(cacheKey);
        }
        

        console.log("Fetching from API...");
        query = encodeURIComponent(query);
        const response = await axios.get(`https://musicx-src.sonu36437.workers.dev/api/search/songs?query=${(query)}&page=0&limit=1`);
        const song = await response.data.data.results[0];

        if (song && song.downloadUrl) {
            console.log("Got new download URL, caching it");
            const cacheData = {
                downloadUrl: song.downloadUrl,
                timestamp: Date.now()
            };
          
            await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
            console.log("Successfully cached song data");
            return song.downloadUrl;
        } else {
            throw new Error('No download URL found for the song');
        }
    } catch (error) {
        console.error('Error in getSongSrc:', error);
        return null;
    }
};
