import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import QuickCrypto from "react-native-quick-crypto";
import { Buffer } from "react-native-buffer";
import { Alert } from "react-native";

// const BaseUrl = "https://open.spotify.com";

const saveToken = async (token, expiryTime) => {
  await AsyncStorage.setItem('accessToken', token);
  await AsyncStorage.setItem('tokenExpiry', expiryTime.toString());
};




const hexToBytes = hex => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
};

const base32FromBytes = (bytes, secretSauce) => {
  let t = 0, n = 0, r = '';
  for (const byte of bytes) {
    n = (n << 8) | byte;
    t += 8;
    while (t >= 5) {
      r += secretSauce[(n >>> (t - 5)) & 0x1f];
      t -= 5;
    }
  }
  if (t > 0) {
    r += secretSauce[(n << (5 - t)) & 0x1f];
  }
  return r;
};

const decodeBase32 = str => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0, value = 0, index = 0;
  const result = new Uint8Array(Math.ceil(str.length * 5 / 8));
  
  for (const c of str) {
    value = (value << 5) | alphabet.indexOf(c);
    bits += 5;
    if (bits >= 8) {
      result[index++] = (value >>> (bits - 8)) & 0xff;
      bits -= 8;
    }
  }
  return result.slice(0, index);
};


const generateTotp = async () => {
  const secretCipherBytes = [12,56,76,33,88,44,88,33,78,78,11,66,22,22,55,69,54];
  const xorBytes = secretCipherBytes.map((e, t) => e ^ (t % 33 + 9));
  const xorString = xorBytes.join('');

  
  
  const utf8Bytes = new TextEncoder().encode(xorString);

  
  const hexString = [...utf8Bytes].map(b => b.toString(16).padStart(2, '0')).join('');
  const secretBytes = hexToBytes(hexString);
  
  
  const secret = base32FromBytes(secretBytes, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567');
  console.log(secret);
  
  
  const serverTimeRes = await fetch('https://open.spotify.com/server-time', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' }
  });
  const { serverTime } = await serverTimeRes.json();
  
  const timeInput = Math.floor(serverTime / 30);
  const key = decodeBase32(secret);
  console.log("key: ", key);
  
  
  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeBigUInt64BE(BigInt(timeInput));
  
  
  const hmac = QuickCrypto.createHmac('sha1', Buffer.from(key));
  hmac.update(timeBuffer);
  const digest = hmac.digest();
  
  const offset = digest[digest.length - 1] & 0x0f;
  const code = digest.readUInt32BE(offset) & 0x7fffffff;
  return (code % 1000000).toString().padStart(6, '0');
};

export async function getAccessToken(reason = "transport") {
  try {
    const spDcCookie = await AsyncStorage.getItem('sp_dc');
    const spKeyCookie = await AsyncStorage.getItem('sp_key');
    const spTCookie = await AsyncStorage.getItem('sp_t');
    console.log("spDcCookie: ", spDcCookie);
    
    if (!spDcCookie) throw new Error('Missing sp_dc cookie');

    const totp = await generateTotp();
    const ts = Math.floor(Date.now() / 1000);
    
    const url = `https://open.spotify.com/get_access_token?reason=${reason}&productType=web_player&totp=${totp}&totpVer=5&ts=${ts}`;
    
    const res = await fetch(url, {
      headers: {
        Cookie: `sp_dc=${spDcCookie}; sp_key=${spKeyCookie}; sp_t=${spTCookie}`,
        // Cookie:"sp_t=9d98fd4217a002ed52d1177226ff6d5d; sp_m=in-en; sp_landing=https%3A%2F%2Fwww.spotify.com%2Fapi%2Fmasthead%2Fv1%2Fmasthead; sp_landingref=https%3A%2F%2Fopen.spotify.com%2F; sp_dc=AQDIAFpb2nf78ToCBbGuBHl2vvFn2Gb1InFdArPDLcC_gL05pT4z_XBLXKNqt8m6Opf8w7w0_vZjy_1eg07ly-jzFeE2-iaQV5Ldvlu57kQgTPzCoFPR0UxZTKhBjibFWGhYaZ3WcPwYgeyyAnSpDxDyOlnrTcfJLGw6aXkFKRZGhqf8FuGyoxzpIRfIN9vCAWDQhXiGNcKHFxxXHg; sp_key=018f5a63-b371-4aa4-ad88-d9c451216d10",
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      }
    });
    
    const data = await res.json();
    console.log(data.accessToken);
    
    
  
    if (!data.accessToken || data.accessToken.length < 376) {
    
        return await getAccessToken("init");
      
     
    }
    
    await saveToken(data.accessToken, data.accessTokenExpirationTimestampMs);
    return {
      accessToken: data.accessToken,
      expiryTime: data.accessTokenExpirationTimestampMs
    };
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

export const getAuthToken = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const expiryTime = await AsyncStorage.getItem('tokenExpiry');
    console.log(accessToken);
   
    
    

    if (accessToken && expiryTime) {
      const isExpired = Date.now() > parseInt(expiryTime);
      if (!isExpired) return accessToken;
    }

    // Fetch new token if expired/missing
    const newToken = await getAccessToken();
    return newToken.accessToken;
  } catch (error) {
    console.error('Auth failed:', error);
    throw error;
  }
};