import React from 'react';
import {Linking, Image, StyleSheet, View} from 'react-native';
import {List, Checkbox, IconButton, withTheme} from 'react-native-paper';

const extractUrl = text => {
  if (!text) {
    return null;
  }

  const matches = text.match(/\b(http|https)?(:\/\/)?(\S*)\.(\w{2,4})\b/gi);
  if (matches == null || matches.length < 1) {
    return null;
  }

  return matches[0];
};

const TodoListItem = ({item, onCheck, onOpen, theme}) => {
  const split = item.description.indexOf('\n');

  const title =
    split > 0 ? item.description.substring(0, split) : item.description;
  // If there is no additional text, set it to a space so the title stays aligned to the top of the item.
  const description =
    split > 0 ? item.description.substring(split).trim() : ' ';
  const url = extractUrl(description);
  const picture = item.picture;

  const imageStyle = {
    ...styles.image,
    borderRadius: theme.roundness,
  };

  return (
    <List.Item
      title={title}
      description={description}
      onPress={() => onOpen(item)}
      left={p => <Checkbox status="unchecked" onPress={onCheck} />}
      right={p => (
        <>
          {url && (
            <IconButton
              icon="open-in-new"
              onPress={() => Linking.openURL(url)}
            />
          )}
          {picture && (
            <View style={styles.imageContainer}>
              <Image style={imageStyle} source={picture} />
            </View>
          )}
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    margin: 6,
  },
  image: {
    width: 36,
    height: 36,
  },
});

export default withTheme(TodoListItem);
