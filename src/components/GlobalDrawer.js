import React, {useState} from 'react';
import {View} from 'react-native';
import {Drawer, Switch} from 'react-native-paper';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import ClearConfirmationDialog from './ClearConfirmationDialog';
import {useStorage, resetData} from '../storage';

const filterCurrentList = state => {
  const filter = route => {
    if (route.name === 'TaskList') {
      return route.params.listId;
    }

    if (route.state) {
      return route.state.routes.reduce(reducer, undefined);
    }

    return undefined;
  };

  const reducer = (accumulator, right) =>
    accumulator ? accumulator : filter(right);

  return state.routes.reduce(reducer, undefined);
};

const GlobalDrawer = ({isDarkTheme, toggleTheme, navigation, state}) => {
  const {storage, dispatch} = useStorage();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const openList = id => navigation.navigate('TaskList', {listId: id});
  const openConfirm = () => setConfirmVisible(true);
  const dismissConfirm = () => setConfirmVisible(false);
  const confirmConfirm = () => {
    setConfirmVisible(false);
    dispatch(resetData());
    navigation.navigate('TaskList');
  };

  const currentList = filterCurrentList(state);

  return (
    <DrawerContentScrollView>
      <Drawer.Section title="Lists">
        {storage.lists.map(list => (
          <Drawer.Item
            active={list.id === currentList}
            key={list.id}
            label={list.name}
            icon={list.icon}
            onPress={() => openList(list.id)}
          />
        ))}
      </Drawer.Section>
      <Drawer.Section title="Preferences">
        <Drawer.Item
          label="Dark Theme"
          onPress={toggleTheme}
          right={() => (
            <View pointerEvents="none">
              <Switch value={isDarkTheme} />
            </View>
          )}
        />
        <Drawer.Item label="Reset Data" onPress={openConfirm} />
      </Drawer.Section>
      <ClearConfirmationDialog
        visible={confirmVisible}
        onConfirm={confirmConfirm}
        onDismiss={dismissConfirm}
      />
    </DrawerContentScrollView>
  );
};

export default GlobalDrawer;
