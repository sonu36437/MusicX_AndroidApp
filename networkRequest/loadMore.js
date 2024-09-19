import axios from "axios";
import {fetchTracks} from "./spotifyRequest";

export const loadMore = async (url) => {
    console.log("load more is called");
    const response = await fetchTracks(url);
    return response;
   

};
