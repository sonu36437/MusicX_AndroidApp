import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getAuthToken } from '../networkRequest/auth';

export default function Home() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getAuthToken();
        setToken(token);
        console.log("Token fetched:", token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []); 

  return (
    <View>
      <Text>{token ? `Token: ${token}` : 'Fetching token...'}</Text>
    </View>
  );
}
