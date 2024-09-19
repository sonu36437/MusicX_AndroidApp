
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