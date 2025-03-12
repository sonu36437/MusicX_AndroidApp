import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Pref() {
    const [genres, setGenres] = useState([
        { id: 1, name: 'Pop', selected: false },
        { id: 2, name: 'Rock', selected: false },
        { id: 3, name: 'Jazz', selected: false },
        { id: 4, name: 'Classical', selected: false },
        { id: 5, name: 'Hip-Hop', selected: false },
    ]);

    const navigation = useNavigation();

    const toggleGenre = (id) => {
        setGenres((prevGenres) =>
            prevGenres.map((genre) =>
                genre.id === id ? { ...genre, selected: !genre.selected } : genre
            )
        );
    };

    const savePreferences = async () => {
        const selectedGenres = genres.filter((genre) => genre.selected).map((genre) => genre.name);
        if (selectedGenres.length === 0) {
            Alert.alert('No genres selected', 'Please select at least one genre.');
            return;
        }

        try {
            await AsyncStorage.setItem('@userGenres', JSON.stringify(selectedGenres));
            Alert.alert('Preferences Saved', 'Your preferences have been saved.');
            navigation.navigate('Tabs'); // Navigate to the "Tabs" screen
        } catch (error) {
            console.error('Error saving preferences:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Choose Your Favorite Genres</Text>
            <FlatList
                data={genres}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.genreItem,
                            item.selected && styles.selectedGenreItem,
                        ]}
                        onPress={() => toggleGenre(item.id)}
                    >
                        <Text
                            style={[
                                styles.genreText,
                                item.selected && styles.selectedGenreText,
                            ]}
                        >
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                )}
            />
            <Button title="Save Preferences" onPress={savePreferences} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    genreItem: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        alignItems: 'center',
    },
    selectedGenreItem: {
        backgroundColor: '#6200ea',
    },
    genreText: {
        fontSize: 16,
        color: 'black',
    },
    selectedGenreText: {
        color: 'white',
    },
});
