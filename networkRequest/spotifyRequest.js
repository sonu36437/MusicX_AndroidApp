import { getAuthToken } from './auth';
import axios from 'axios';

export async function fetchTracks(url) {

    console.log("new requeset is comming ",url);
    const accessToken = await getAuthToken();
    try {
        const response = await axios.get(url || 'https://api.spotify.com/v1/me/tracks', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
     
        return response.data; 
    } catch (e) {
        console.error("Error fetching tracks:", e);
        throw e; 
    }
}
export async function addToLikedList(id) {
    const accessToken = await getAuthToken();
    const URL = `https://api.spotify.com/v1/me/tracks?ids=${id}`;
    try {
        const response = await axios.put(URL,
            { ids: [id] },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
            });
        return response.data;
    } catch (e) {
        console.error("Error adding to liked list:", e);
        throw e; 
    }
}
export async function removeFromLikedList(id) {
    const accessToken = await getAuthToken();
    console.log("Remove method called");
  
    const URL = `https://api.spotify.com/v1/me/tracks?ids=${id}`;
  
    try {
   
      const response = await axios.delete(URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
  
      console.log("Song removed successfully:", response.data);
      return response.data;
    } catch (error) {
    
      if (error.response) {
        const { status, message } = error.response.data.error;
  
        if (status === 401) {
          console.error("Unauthorized: Bad or expired token. Please re-authenticate.");
        } else if (status === 403) {
          console.error("Forbidden: The user does not have the required permissions.");
        } else if (status === 429) {
          console.error("Too Many Requests: You have hit the rate limit. Try again later.");
        } else {
          console.error(`Error ${status}: ${message}`);
        }
      } else {
        console.error("An unexpected error occurred:", error.message);
      }
  
      throw error; 
    }
  }