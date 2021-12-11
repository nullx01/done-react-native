import React, {useEffect, useState} from 'react';
import {SectionList, StyleSheet} from 'react-native';
import {List, FAB} from 'react-native-paper';
import TodoListItem from './TodoListItem';
import takePhoto from '../takePhoto';

const TaskList = ({
  tasks,
  onCreateTask,
  onOpenTask,
  onRemoveTask,
  searchString,
}) => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const filter = allTasks =>
      allTasks.filter(task =>
        task.description?.toLowerCase().includes(searchString.toLowerCase()),
      );

    const filteredTasks = searchString ? filter(tasks) : tasks;

    const now = Date.now();

    const groupedTasks = filteredTasks.reduce((accumulator, task) => {
      const dueDate = task.dueDate ? task.dueDate.getTime() : now;
      accumulator.set(dueDate, [...(accumulator.get(dueDate) || []), task]);
      return accumulator;
    }, new Map());

    const sectionedTasks = Array.from(groupedTasks, ([key, value]) => ({
      date: new Date(key),
      data: value,
    }));

    sectionedTasks.sort((a, b) =>
      a.date < b.date ? -1 : a.date > b.date ? 1 : 0,
    );

    setSections(sectionedTasks);
  }, [tasks, searchString]);

  return (
    <>
      <SectionList
        contentContainerStyle={styles.itemsContainer}
        contentInsetAdjustmentBehavior="automatic"
        sections={sections}
        keyExtractor={(item, index) => item.id}
        renderItem={({item, index}) => {
          return (
            <TodoListItem
              item={item}
              onCheck={() => onRemoveTask(item)}
              onOpen={onOpenTask}
            />
          );
        }}
        renderSectionHeader={({section: {date}}) => (
          <List.Subheader>{date.toLocaleDateString()}</List.Subheader>
        )}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => onCreateTask()}
        onLongPress={() =>
          takePhoto(picture => {
            onCreateTask({
              picture,
            });
          })
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  itemsContainer: {
    paddingBottom: 76,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default TaskList;
