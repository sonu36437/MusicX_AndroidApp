import { create } from 'zustand';
import axios from 'axios';
import playerManagement from '../PlayerMangement';
import UserPlaylists from '../../networkRequest/userPlayList';

const playlistStore = create((set) => ({
  currentUserPlaylist: [],
  loading: false,
  error: null,

  fetchPlaylists: async () => {
    set({ loading: true, error: null });
    try {
      const response = await UserPlaylists.getUserPlaylist();
   
      
      set({ 
        currentUserPlaylist: response.data,
        error: null 
      });
    } catch (err) {
      set({ 
        error: 'Failed to fetch playlists. Please check your internet connection and try again.',
        currentUserPlaylist: [] 
      });
    } finally {
      set({ loading: false });
    }
  },
}));

export default playlistStore;
