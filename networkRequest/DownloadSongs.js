import RNFS from 'react-native-fs';
import { getSongSrc } from './songSrc';
import { Alert, ToastAndroid } from 'react-native';
import notifee, { TimeUnit } from '@notifee/react-native';
const downloadLocation=`${RNFS.DocumentDirectoryPath}/downloads`
let currentDownloadId=null;


async function isDirectoryExists(){
    const exists= await RNFS.exists(downloadLocation);

    
    
    if(!exists){
        await RNFS.mkdir(downloadLocation);
        console.log("create directory");
        return;
        
    }
    console.log("already exists");
    
}
 export async function downloadSong(songDetails){
    try {
        console.log("songid "+songDetails.id);
        
        await isDirectoryExists();
        await notifee.requestPermission();
        
        const downloadDetails =songDetails.title +" "+ songDetails.artistArray[0].name;
        const response=  await getSongSrc(downloadDetails);
        console.log(response[response?.length-1]?.url);
        const songUrl=response[response?.length-1].url
   
        

        const songFilePath=`${downloadLocation}/${songDetails.id}.mp4`
        const thumbnailPath=`${downloadLocation}/${songDetails.id}_.jpg`
        const songMetaDataPath=`${downloadLocation}/${songDetails.id}_metadata.json`

        const songExists = await RNFS.exists(songFilePath);
        if (songExists) {
            console.log(`Song already exists: ${songFilePath}`);
            ToastAndroid.show("song Already Downloaded",ToastAndroid.SHORT);
        
            return;
        }

        const songDownload =RNFS.downloadFile({
            fromUrl:songUrl,
            toFile:songFilePath,
            progressDivider:10,
            begin:()=>{
                console.log("download started");
                currentDownloadId=songDownload.jobId;
                
            },
            progress: async (res) => {
                const percentage = ((res.bytesWritten/res.contentLength)*100).toFixed(0);
                const downloadedMB = (res.bytesWritten / 1048576).toFixed(2);
                const totalMB = (res.contentLength / 1048576).toFixed(2);
                
                // Create notification channel
                const channelId = await notifee.createChannel({
                    id: 'downloads',
                    name: 'Downloads',
                    importance: 4, // High importance
                    vibration: true,
                });

                await notifee.displayNotification({
                    id: songDetails.id,
                    title: `Downloading: ${songDetails.title}`,
                    body: `${downloadedMB}MB / ${totalMB}MB (${percentage}%)`,
                    android: {
                        channelId,
                        ongoing: true,
                        progress: {
                            max: 100,
                            current: parseInt(percentage),
                        },
                        smallIcon: '@mipmap/ic_launcher', 
                    },
                });
            }
          

        })
        const result= songDownload.promise;
        if((await result).statusCode!==200){
            console.log("failed to download");
            currentDownloadId=null;
            await notifee.displayNotification({
                id: songDetails.id,
                title: 'Download Failed',
                body: `Failed to download ${songDetails.title}`,
                android: {
                    channelId: 'downloads',
                    smallIcon: 'ic_launcher',
                },
            });
        }
        else {
            console.log("download completed");
            await notifee.displayNotification({
                id: songDetails.id,
                title: 'Download Complete',
                body: `Successfully downloaded ${songDetails.title}`,
                android: {
                    channelId: 'downloads',
                    smallIcon: 'ic_launcher',
                },
            });
            currentDownloadId=null;
        }
        console.log(`Downloading thumbnail for: ${songDetails.title}`);
        const thumbnailDownload = RNFS.downloadFile({
            fromUrl: songDetails.image, 
            toFile: thumbnailPath, 
        });
        const thumbnailResult = await thumbnailDownload.promise;
        if (thumbnailResult.statusCode !== 200) {
            throw new Error(`Thumbnail download failed with status code: ${thumbnailResult.statusCode}`);
        }

        console.log(`Thumbnail download complete: ${thumbnailPath}`);
      

        const metadata = {
            id: songDetails.id,
            title: songDetails.title,
            artist: songDetails.artistArray[0].name,
            thumbnailPath: thumbnailPath, 
            songPath: songFilePath, 
            downloadedAt: new Date().toISOString(), 
        };
        await RNFS.writeFile(songMetaDataPath,JSON.stringify(metadata,null,2),'utf8');
        console.log("metadata saved:", metadata);
    ToastAndroid.show("song Downloaded Successfully",ToastAndroid.SHORT)

    } catch (error) {
        console.error("Download failed:", error);
        Alert.alert("Download failed", error.message);
    }
}

export async function checkIfDownloaded(songId){
    const songname= `${downloadLocation}/${songId}.mp4`
    if(await RNFS.exists(songname)){
        console.log("already donloaded");
        
        return true;
    }
return false;
}