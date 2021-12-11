import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TaskListScreen from './TaskListScreen';
import EditTaskScreen from './EditTaskScreen';
import EditListScreen from './EditListScreen';
import {useStorage} from '../storage';
import DefaultHeader from '../components/DefaultHeader';
import TaskListHeader from '../components/TaskListHeader';

const Stack = createNativeStackNavigator();

const HomeScreen = () => {
  // TODO this will be configurable in the settings screen
  const backOnSave = true;

  const [searchString, setSearchString] = useState('');

  const {storage} = useStorage();

  // Don't show anything until the tasks are loaded
  if (!storage.tasksLoaded) {
    return null;
  }

  const initialListId = storage.lists[0].id;

  return (
    <Stack.Navigator
      initialRouteName="TaskList"
      presentation="modal"
      screenOptions={{header: props => <DefaultHeader {...props} />}}>
      <Stack.Screen
        name="TaskList"
        initialParams={{listId: initialListId}}
        options={{
          header: props => (
            <TaskListHeader {...props} onChangeSearch={setSearchString} />
          ),
        }}>
        {props => <TaskListScreen {...props} searchString={searchString} />}
      </Stack.Screen>
      <Stack.Screen
        name="TaskDetails"
        options={{
          headerTitle: 'Task details',
        }}>
        {props => <EditTaskScreen {...props} backOnSave={backOnSave} />}
      </Stack.Screen>
      <Stack.Screen
        name="TaskCreation"
        options={{
          headerTitle: 'New task',
        }}>
        {props => (
          <EditTaskScreen {...props} initialEdit={true} backOnSave={true} />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="ListDetails"
        options={{
          headerTitle: 'Edit list',
        }}>
        {props => <EditListScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default HomeScreen;
