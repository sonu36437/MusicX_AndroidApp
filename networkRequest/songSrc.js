import axios from "axios";

export const getSongSrc = async (query) => {
    console.log("fetching song src................",query);
    try {
       
        query=encodeURIComponent(query);
        const response = await axios.get(`https://jiosaavan36437.vercel.app/api/search/songs?query=${(query)}&page=0&limit=1`);
        const song = await response.data.data.results[0]; 
        // console.log(song);

        if (song && song.downloadUrl) {
            return song.downloadUrl; 
        } else {
            throw new Error('No download URL found for the song');
        }
    } catch (error) {
        console.error('Error fetching song download URL:', error.message);
        return null;
    }
};
