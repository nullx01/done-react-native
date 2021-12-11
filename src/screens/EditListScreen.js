import React, {useState} from 'react';
import {ScrollView, StyleSheet, View, Pressable} from 'react-native';
import {TextInput, FAB, Menu} from 'react-native-paper';
import {useStorage, updateList} from '../storage';

const listColorToLabel = color => {
  switch (color) {
    case null:
    case undefined:
      return 'Default';
    default:
      return color.charAt(0).toUpperCase() + color.slice(1);
  }
};

const EditListScreen = ({
  navigation,
  route,
  initialEdit,
  backOnSave,
  listId,
}) => {
  const {storage, dispatch} = useStorage();

  const list = listId
    ? storage.lists.find(l => l.id === listId)
    : storage.lists[0];

  const [name, setName] = useState(list.name);
  const [description, setDescription] = useState(list.description);
  const [color, setColor] = useState(list.color);
  const [menuVisible, setMenuVisible] = useState(false);

  const saveList = () => {
    dispatch(updateList({...list, name, description, color}));
    navigation.goBack();
  };

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const selectColor = selectedColor => {
    setColor(selectedColor);
    setMenuVisible(false);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={[styles.row, styles.nameRow]}>
          <TextInput
            mode="flat"
            label="Name"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={[styles.row, styles.descriptionRow]}>
          <TextInput
            mode="flat"
            label="Description"
            value={description}
            onChangeText={setDescription}
          />
        </View>
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <Pressable onPress={openMenu}>
              <View style={[styles.row, styles.colorRow]}>
                <TextInput
                  mode="flat"
                  label="Color"
                  value={listColorToLabel(color)}
                  right={
                    <TextInput.Icon
                      name="chevron-down"
                      onPress={openMenu}
                      forceTextInputFocus={false}
                    />
                  }
                  editable={false}
                />
              </View>
            </Pressable>
          }>
          <Menu.Item onPress={() => selectColor(null)} title="Default" />
          <Menu.Item onPress={() => selectColor('red')} title="Red" />
          <Menu.Item onPress={() => selectColor('green')} title="Green" />
          <Menu.Item onPress={() => selectColor('blue')} title="Blue" />
          <Menu.Item onPress={() => selectColor('yellow')} title="Yellow" />
        </Menu>
      </ScrollView>
      <FAB
        style={styles.fab}
        icon={'content-save'}
        label={'Save'}
        disabled={!name}
        onPress={saveList}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    marginHorizontal: 16,
  },
  nameRow: {
    marginTop: 16,
  },
  descriptionRow: {
    marginTop: 24,
  },
  colorRow: {
    marginTop: 24,
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default EditListScreen;
