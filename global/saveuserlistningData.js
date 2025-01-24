import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchTracks } from "../networkRequest/spotifyRequest";

const key = "userPref"; // Storage key

// Save user listening activity
export async function saveUserListeningActivity(songDetails) {
  try {
    // Fetch existing stored data
    const storedData = await AsyncStorage.getItem(key);
    const songArray = storedData ? JSON.parse(storedData) : [];

    // Check if song or artist already exists
    const isSongPresent = songArray.some((song) => song.id === songDetails.id);
    const artistAlreadyPresent = songArray.some((song) =>
      song.artists.includes(songDetails.artists[0]) // Match the first artist (or modify as needed)
    );

    if (isSongPresent || artistAlreadyPresent) {
      console.log("Song or artist already in the list:", songDetails.id);
      return;
    }

    // Add new song
    songArray.push(songDetails);

    // Limit array size to 20
    if (songArray.length > 20) {
      songArray.shift();
    }

    // Save updated array to AsyncStorage
    await AsyncStorage.setItem(key, JSON.stringify(songArray));
    console.log("Updated songArray:", songArray);
  } catch (error) {
    console.error("Error saving song to storage:", error);
  }
}

// Get stored user preferences
export async function getStoredPref() {
  try {
    const storedData = await AsyncStorage.getItem(key);
    const songs = storedData ? JSON.parse(storedData) : [];
    return songs;
  } catch (error) {
    console.error("Error fetching songs from storage:", error);
    return [];
  }
}
 export async  function getRecommendTracks(searchQuery) {
    try {
      console.log(searchQuery);
      const url = `https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=1`;
      const res = await fetchTracks(url);

      const data = res.tracks.items.map((ele) => ele);
      return data;
    } catch (error) {
      console.error("Error in getNewTracks:", error);
      return [];
    }
  }

