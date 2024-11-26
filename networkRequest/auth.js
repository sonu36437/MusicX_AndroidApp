import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BaseUrl = "https://open.spotify.com";

const saveToken = async (token, expiryTime) => {
  await AsyncStorage.setItem('accessToken', token);
  await AsyncStorage.setItem('tokenExpiry', expiryTime.toString());
};


export const getAccessToken = async () => {
  const spDcCookie = await AsyncStorage.getItem('sp_dc');
  const userAgent = 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36';

  try {
    const response = await axios.get(`${BaseUrl}/get_access_token`, {
      headers: {
        'Cookie': `sp_dc=${spDcCookie}`,
        'User-Agent': userAgent,
      },
    });

    const accessToken = response.data.accessToken;
    const tokenExpiry = response.data.accessTokenExpirationTimestampMs;
    await saveToken(accessToken, tokenExpiry);

    return accessToken;
  } catch (e) {
    console.error('Error fetching access token:', e);
    throw e;
  }
};


export const getAuthToken = async () => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  const expiryTime = await AsyncStorage.getItem('tokenExpiry');

  if (accessToken && expiryTime) {
    const isTokenExpired = new Date().getTime() > parseInt(expiryTime);

    if (isTokenExpired) {
      console.log("token exipred renewing token");

      return await getAccessToken();
    }
    console.log("token not expired prevouesly");
    return accessToken;
  } else {
    console.log("first time token");
    return await getAccessToken();
  }
};
