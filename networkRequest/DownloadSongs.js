import RNFS from 'react-native-fs';
import { getSongSrc } from './songSrc';
import { Alert } from 'react-native';
const downloadLocation=`${RNFS.DocumentDirectoryPath}/downloads`


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
        
            return;
        }

        const songDownload =RNFS.downloadFile({
            fromUrl:songUrl,
            toFile:songFilePath,
            progressDivider:10,
            begin:()=>{
                console.log("download started");
                
            },
            progress:(res)=>{
                const percentage=( (res.bytesWritten/res.contentLength)*100).toFixed(0);
                console.log(percentage);
                
            }
          

        })
        const result= songDownload.promise;
        if((await result).statusCode!==200){
            console.log("failed to download");

            
        }
        else{
            console.log("download completed");
            
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
        Alert.alert("Song downloaded successfully");

    } catch (error) {
        console.error("Download failed:", error);
        Alert.alert("Download failed", error.message);
    }
}