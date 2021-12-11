import React, {useEffect, useState, useRef} from 'react';
import {Platform, StatusBar} from 'react-native';
import {Appbar, Menu, Searchbar, withTheme} from 'react-native-paper';
import color from 'color';
import {useStorage} from '../storage';
import ExportModule from '../ExportModule';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const defaultExportFilename = now =>
  `done-export_${now.getFullYear()}-${
    now.getMonth() + 1
  }-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}.json`;

const TaskListHeader = ({onChangeSearch, theme, navigation, route}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchString, setSearchString] = useState('');

  const {storage} = useStorage();

  const searchbarRef = useRef();

  useEffect(() => {
    if (searchVisible) {
      // Using the `setTimeout` workaround, otherwise the keyboard does not appear.
      // https://github.com/software-mansion/react-native-screens/issues/89
      setTimeout(() => searchbarRef.current?.focus(), 100);
    }
  }, [searchVisible]);

  const closeSearch = () => {
    setSearchString('');
    setSearchVisible(false);
  };

  const openEdit = () => {
    setMenuVisible(false);
    navigation.navigate('ListDetails');
  };

  const exportTasksAsync = async () => {
    try {
      await ExportModule.exportJsonFile(
        defaultExportFilename(new Date()),
        JSON.stringify(storage.tasks),
      );
      console.log('Tasks exported');
    } catch (e) {
      console.error(e);
    }
  };

  const exportTasks = () => {
    exportTasksAsync();
    setMenuVisible(false);
  };

  useEffect(() => {
    onChangeSearch?.(searchString);
  }, [searchString, onChangeSearch]);

  const listId = route.params.listId;
  const list = storage.lists.find(element => element.id === listId);

  const headerTitle = list.name;
  const headerSubtitle = list.description;
  const headerColor = list.color ? list.color : theme.colors.primary;
  const isDark = color(headerColor).isDark();

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Appbar.Header
        style={{backgroundColor: headerColor}}
        statusBarHeight={StatusBar.currentHeight}>
        {searchVisible && (
          <Searchbar
            placeholder="Search"
            icon="arrow-left"
            onIconPress={closeSearch}
            onChangeText={text => setSearchString(text)}
            ref={searchbarRef}
          />
        )}
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title={headerTitle} subtitle={headerSubtitle} />
        <Appbar.Action icon="magnify" onPress={() => setSearchVisible(true)} />
        <Menu
          statusBarHeight={StatusBar.currentHeight}
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon={MORE_ICON}
              color={isDark ? 'white' : 'black'}
              onPress={() => setMenuVisible(true)}
            />
          }>
          <Menu.Item onPress={openEdit} title="Edit list" />
          <Menu.Item onPress={exportTasks} title="Export tasks" />
        </Menu>
      </Appbar.Header>
    </>
  );
};

export default withTheme(TaskListHeader);
