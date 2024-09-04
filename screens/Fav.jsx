import { View, Text, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuthToken } from '../networkRequest/auth';

async function fetchTracks() {
    const accessToken=await getAuthToken()
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/tracks', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(response.data);
        
        return response.data; // Return the response data
    } catch (e) {
        console.error("Error fetching tracks:", e);
        throw e; // Optionally rethrow the error
    }
}

export default function Fav() {
    const [tracks, setTracks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchTracks();
                setTracks(data.items); // Set tracks data
            } catch (err) {
                setError('Failed to fetch tracks');
            }
        };

        fetchData();
    }, []);

    const renderItem = ({ item }) => {
        const track = item.track; // Access the track details
        return (
            <View style={{ marginBottom: 20 ,}}>
                <Image
                    source={{ uri: track.album.images[0].url }}
                    style={{ width: 100, height: 100 }}
                />
                <Text style={{fontFamily:'Outline-Bold'}}>Name: {track.name}</Text>
                <Text>Album: {track.album.name}</Text>
                <Text>Artists: {track.artists.map(artist => artist.name).join(', ')}</Text>
                <Text>Release Date: {track.album.release_date}</Text>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Favorite Tracks</Text>
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
            <FlatList
                data={tracks}
                renderItem={renderItem}
                keyExtractor={(item) => item.track.id}
            />
        </View>
    );
}