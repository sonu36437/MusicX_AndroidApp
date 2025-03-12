import { fetchTracks } from "./spotifyRequest";
import { getStoredPref } from "../global/saveuserlistningData";

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

  async getNewTracks(searchQuery,limit=50) {
    try {
      console.log(searchQuery);
      const url = `https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=${limit}`;
      const res = await fetchTracks(url);

      const data = res.tracks.items.map((ele) => ele);
      return data;
    } catch (error) {
      console.error("Error in getNewTracks:", error);
      return [];
    }
  }
}

const Homedata = new HomeData();
export default Homedata;
