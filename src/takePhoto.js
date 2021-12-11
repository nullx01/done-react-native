import {launchCamera} from 'react-native-image-picker';

const takePhoto = callback => {
  launchCamera(
    {
      mediaType: 'photo',
      cameraType: 'front',
      includeBase64: true,
      saveToPhotos: false,
      maxWidth: 800,
      maxHeight: 800,
    },
    response => {
      if (response.didCancel) {
        return;
      }

      if (response.assets.length > 0) {
        const asset = response.assets[0];

        const fotoUri = 'data:' + asset.type + ';base64,' + asset.base64;
        const fotoWidth = asset.width;
        const fotoHeight = asset.height;

        callback({
          uri: fotoUri,
          width: fotoWidth,
          height: fotoHeight,
        });
      }
    },
  );
};

export default takePhoto;
