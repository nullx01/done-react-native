import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ActivityIndicator, useTheme} from 'react-native-paper';
import TaskList from '../components/TaskList';
import {useStorage, removeTask} from '../storage';

const TaskListScreen = ({navigation, searchString, route}) => {
  const {storage, dispatch} = useStorage();
  const {colors} = useTheme();

  const listId = route.params.listId;
  const list = storage.lists.find(element => element.id === listId);
  const tasks = list && list.tasks ? list.tasks : [];

  const onCreateTask = task => navigation.navigate('TaskCreation', {task});
  const onOpenTask = task => navigation.navigate('TaskDetails', {task});
  const onRemoveTask = task => dispatch(removeTask(task.id));

  return storage.tasksLoaded ? (
    <TaskList
      tasks={tasks}
      onOpenTask={onOpenTask}
      onCreateTask={onCreateTask}
      onRemoveTask={onRemoveTask}
      searchString={searchString}
    />
  ) : (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default TaskListScreen;
