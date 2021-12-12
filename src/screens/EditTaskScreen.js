import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {TextInput, FAB, HelperText} from 'react-native-paper';
import PhotoInput from '../components/PhotoInput';
import DateInput from '../components/DateInput';
import {useStorage, createTask, updateTask} from '../storage';

const EditTaskScreen = ({navigation, route, initialEdit, backOnSave}) => {
  const listId = route.params.listId;
  const task = route?.params?.task ? route.params.task : {};

  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [picture, setPicture] = useState(task.picture);
  const [edit, setEdit] = useState(initialEdit ? initialEdit : false);

  const descriptionInput = useRef();

  const {dispatch} = useStorage();

  const saveTask = () => {
    setEdit(false);
    if (task.id) {
      dispatch(
        updateTask(listId, {id: task.id, description, dueDate, picture}),
      );
    } else {
      dispatch(createTask(listId, {description, dueDate, picture}));
    }
    if (backOnSave) {
      navigation.goBack();
    }
  };

  useEffect(() => {
    if (edit) {
      // Directly calling `focus` here leads to the textinput bluring immediately after. Using
      // the `setTimeout` workaround from https://github.com/react-navigation/react-navigation/issues/8564.
      setTimeout(() => descriptionInput.current.focus(), 100);
    }
  }, [edit]);

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={[styles.row, styles.descriptionRow]}>
          <TextInput
            mode="flat"
            label="Description"
            value={description}
            onChangeText={setDescription}
            editable={edit}
            ref={descriptionInput}
            multiline={true}
          />
          <HelperText visible={edit && !description} type={'error'}>
            Description is required
          </HelperText>
        </View>
        <View style={[styles.row, styles.dueDateRow]}>
          <DateInput
            mode="flat"
            label="Due date"
            value={dueDate}
            onChangeDate={setDueDate}
            editable={edit}
          />
        </View>
        <View style={[styles.row, styles.imageRow]}>
          <PhotoInput
            mode="flat"
            label="Picture"
            value={picture}
            onChangePhoto={setPicture}
            editable={edit}
          />
          <HelperText visible={edit && !!picture}>
            Tap and hold to update the picture
          </HelperText>
        </View>
      </ScrollView>
      <FAB
        style={styles.fab}
        icon={edit ? 'content-save' : 'pen'}
        label={edit ? 'Save' : 'Edit'}
        disabled={!description}
        onPress={() => (edit ? saveTask() : setEdit(true))}
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
  descriptionRow: {
    marginTop: 16,
  },
  dueDateRow: {
    marginTop: 0,
  },
  imageRow: {
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

export default EditTaskScreen;
