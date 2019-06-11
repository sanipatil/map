import RNFetchBlob from 'react-native-fetch-blob';
import Share from 'react-native-share';


class ShareExport {
    shareData = (FILE_PATH, csvString) => {
        this.exportData(FILE_PATH, csvString);
        let path = `file://${FILE_PATH}`;
        let options = {
            url: path,
        }
        Share.open(options);
    }

    exportData = (FILE_PATH, csvString) => {
        RNFetchBlob.fs
            .writeFile(FILE_PATH, csvString, "utf8")
            .then((res) => {
                //alert("File updated succesfully");
            })
            .catch(error => alert(error.message));
    }
}

export default new ShareExport()