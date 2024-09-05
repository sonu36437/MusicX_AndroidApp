import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuthToken } from '../networkRequest/auth';

import TrackItem from '../components/TrackItem';

async function fetchTracks(url) {
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

export default function Fav() {
    const [tracks, setTracks] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await fetchTracks();
                setTracks(data.items);
                setNextPageUrl(data.next);
                setHasMore(data.next); 
            } catch (err) {
                setError('Failed to fetch tracks');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const loadMoreTracks = async () => {
        if (hasMore && nextPageUrl && !isLoading) {
            try {
                setIsLoading(true);
                const data = await fetchTracks(nextPageUrl);
                setTracks(prevTracks => [...prevTracks, ...data.items]);
                setNextPageUrl(data.next);
                setHasMore(data.next); 
            } catch (err) {
                setError('Failed to load more tracks');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const renderItem = ({ item }) => {
        const track = item.track;
        return (
       
            <TrackItem track={track}/>
        );
    };
   

    return (
        <View style={styles.container}>
            <View style={{ paddingTop: 10, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.title}>Liked Songs</Text>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <FlatList
                data={tracks}
                renderItem={renderItem}
                keyExtractor={(item) => item.track.id}
                contentContainerStyle={styles.listContent}
                onEndReached={loadMoreTracks}
                onEndReachedThreshold={0.5} 
                ListFooterComponent={isLoading ? <Text style={styles.loadingText}>Loading...</Text> : null}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black', 
        paddingHorizontal: 20,
        paddingTop: 20,
     paddingBottom:'30%',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5
    },
    title: {
        fontSize: 24,
        fontFamily: 'Outfit-Bold',
        color: '#fff',
        marginBottom: 20,
    },


    errorText: {
        color: 'red',
        marginBottom: 20,
    },
    listContent: {
        paddingBottom: 10,
    },
    loadingText: {
        fontFamily: 'Outfit-Bold',
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
        marginVertical: 20,
    },
});