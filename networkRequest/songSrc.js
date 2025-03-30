import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getSongSrc = async (query) => {
    console.log("Starting getSongSrc with query:", query);
    try {
       
        const cacheKey = query.trim();
        console.log("Checking cache for key:", cacheKey);
        
        const cachedSong = await AsyncStorage.getItem(cacheKey);
      
        
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
        const response =   await fetchJioSaavnResults(query);
        const results = response.data?.results;
        if (!results || results.length === 0) {
            return res.status(404).json({ error: "No results found" });
        }
        const encryptedUrl = results[0].more_info?.encrypted_media_url;
        console.log( encryptedUrl);
        
        const song = (await (axios.get(`https://personal-jio-saavan.vercel.app/search?q=${encodeURIComponent(encryptedUrl)}`))).data;
            

        

        if (song) {
            console.log("Got new download URL, caching it");
            const cacheData = {
                downloadUrl: song,
                timestamp: Date.now()
            };
          
            await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
            console.log("Successfully cached song data");
            return song;
        } else {
            throw new Error('No download URL found for the song');
        }
    } catch (error) {
        console.error('Error in getSongSrc:', error);
        return null;
    }
};


const fetchJioSaavnResults = async (queryParam) => {
    try {
        const response = await axios.get(
            `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&q=${queryParam}&p=0&n=1`,
           
        );
   
        
        return response;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
};