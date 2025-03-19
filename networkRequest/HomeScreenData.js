import { fetchTracks } from "./spotifyRequest";
import { getStoredPref } from "../global/saveuserlistningData";
import AsyncStorage from '@react-native-async-storage/async-storage';

class HomeData {

  async getUserSavedArtists() {
    try {
      const data = await getStoredPref();

      // Extract artists and flatten the array
      const savedArtists = data.flatMap((d) => d.artists || []);

      if (savedArtists.length < 3) {
        return null; // No action if there are less than 3 artists
      }

      // Get the last 3 artists
      const recentlyListenedArtists = savedArtists.slice(-7);

      // Combine into a single string
      const prefInString = recentlyListenedArtists.join(" ");
      console.log(prefInString);

      return prefInString;
    } catch (error) {
      console.error("Error in getUserTopSongs:", error);
      return null;
    }
  }


  async getNewTracks(searchQuery, limit = 50) {
    const cacheKey = `cache_${encodeURIComponent(searchQuery)}_${limit}`;

    try {
     
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (cachedData) {
        const parsedCache = JSON.parse(cachedData);
        const cacheAge = Date.now() - parsedCache.timestamp;
        
 
        if (cacheAge < 2 * 24 * 60 * 60 * 1000) {
          console.log('Returning cached tracks');
          return parsedCache.data;
        }
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }

    try {
      console.log(searchQuery);
      const url = `https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=${limit}`;
      const res = await fetchTracks(url);

      const data = res.tracks.items.map((ele) => ele);

     
      try {
        const cacheValue = JSON.stringify({
          data: data,
          timestamp: Date.now()
        });
        await AsyncStorage.setItem(cacheKey, cacheValue);
      } catch (cacheError) {
        console.error('Error saving cache:', cacheError);
      }

      return data;
    } catch (error) {
      console.error("Error in getNewTracks:", error);
      
      // Optional: Return expired cache if available
      try {
        const cachedData = await AsyncStorage.getItem(cacheKey);
        if (cachedData) {
          return JSON.parse(cachedData).data;
        }
      } catch (fallbackError) {
        console.error('Error retrieving fallback cache:', fallbackError);
      }
      
      return [];
    }
  }
}

const Homedata = new HomeData();
export default Homedata;