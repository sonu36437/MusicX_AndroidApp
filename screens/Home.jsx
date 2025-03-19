import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  FlatList,
  // ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { usePlayerContext } from '../context/PlayerContext';
import Homedata from '../networkRequest/HomeScreenData';
import Loading from '../components/Loading';

const { width, height } = Dimensions.get('window');

const NewSongList = ({ data, title }) => {
  const { addToQueue } = usePlayerContext();

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.songCard}
            onPress={() => addToQueue(data, index, 'home')}
          >
            <Image
              source={{ uri: item.album.images[0].url }}
              style={styles.songImage}
            />
            <View style={styles.textContainer}>
              <Text style={styles.songName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.artistName} numberOfLines={1}>
                {item.artists.map((artist) => artist.name).join(', ')}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default function Home() {
  const [newTracks, setNewTracks] = useState([]);
  const [bollywoodHits, setBollywoodHits] = useState([]);
  const [tophindi, setTopHindi] = useState([]);
  const [userChoice, setUserChoice] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getHomeData = async () => {
    try {
      const newTrackRes = await Homedata.getNewTracks('top english');
      const bollywoodRes = await Homedata.getNewTracks('Trending songs');
      const Test = await Homedata.getNewTracks('top Hindi');
 
    

      const userPrefQuery = await Homedata.getUserSavedArtists();
      const userPref = userPrefQuery ? await Homedata.getNewTracks(userPrefQuery) : "";

      setNewTracks(newTrackRes);
      setBollywoodHits(bollywoodRes);
      setTopHindi(Test);
      
      setUserChoice(userPref);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getHomeData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} alwaysBounceVertical={true}  bouncesZoom={true}>
        <NewSongList data={newTracks} title="Top English" />
        <NewSongList data={bollywoodHits} title="Bollywood Hits" />
        <NewSongList data={tophindi} title="Top Hindi" />
      
      
       
        
       
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContainer: {
    paddingBottom: 150,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: 'white',
    fontFamily: 'Outfit-Bold',
    fontSize: 18,
    // paddingHorizontal: 20,
    paddingLeft:10,
    marginBottom: 5,
  },
  songCard: {
    height: height / 4,
    width: width / 3,
    marginHorizontal: 10,
    backgroundColor: 'rgba(22,30,22,0.5)',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  songImage: {
    width: '100%',
    height: '65%',
  },
  textContainer: {
    padding: 10,
  },
  songName: {
    color: 'white',
    fontFamily: 'Outfit-Medium',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  artistName: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Outfit-Light',
    fontSize: 14,
    textAlign: 'center',
  },
});
