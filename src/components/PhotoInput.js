import React from 'react';
import {Image, StyleSheet, Pressable, View} from 'react-native';
import {TextInput, withTheme} from 'react-native-paper';
import takePhoto from '../takePhoto';

const PhotoInput = ({editable, mode, value, label, onChangePhoto, theme}) => {
  const updatePicture = () => takePhoto(photo => onChangePhoto(photo));
  const removePicture = () => onChangePhoto(null);

  const imageStyle = {
    ...styles.image,
    borderRadius: theme.roundness,
  };

  const imageIconStyle = {
    backgroundColor: theme.colors.background,
  };

  return (
    <Pressable
      disabled={!editable}
      onPress={value ? () => {} : updatePicture}
      onLongPress={updatePicture}>
      <TextInput
        mode={mode}
        label={label}
        editable={false}
        value={value ? ' ' : null}
        render={props =>
          value ? (
            <View style={styles.imageContainer}>
              <Image source={value} style={imageStyle} resizeMode="cover" />
            </View>
          ) : undefined
        }
        right={
          (!value || editable) && (
            <TextInput.Icon
              name={value ? 'delete-forever' : 'camera'}
              onPress={value ? removePicture : updatePicture}
              disabled={!editable}
              forceTextInputFocus={false}
              style={imageIconStyle}
            />
          )
        }
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    paddingTop: 36,
    paddingRight: 12,
    paddingLeft: 12,
    paddingBottom: 12,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
});

export default withTheme(PhotoInput);
