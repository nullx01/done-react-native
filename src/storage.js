import React, {createContext, useContext, useEffect, useReducer} from 'react';
import {Image} from 'react-native';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dummyFoto from './assets/dummy-foto.png';

const ASYNC_STORAGE_TASKS_KEY = 'todoItems';

const ASYNC_STORAGE_LIST_KEY = 'todoList';

const defaultLists = [
  {
    id: uuid.v4(),
    name: 'Private',
    description: 'List of private tasks',
    icon: 'home',
    tasks: [
      {
        id: uuid.v4(),
        description:
          'Welcome\n\nTap the checkbox to the left to finish this task.',
        picture: null,
      },
      {
        id: uuid.v4(),
        description:
          'Your tasks can contain links\n\nVisit https://example.com by tapping the button on the right.',
        picture: null,
      },
      {
        id: uuid.v4(),
        description:
          'Attach a photo\n\nTap and hold the plus button to create a task with a photo.',
        picture: Image.resolveAssetSource(dummyFoto),
      },
    ],
  },
  {
    id: uuid.v4(),
    name: 'Work',
    description: 'List of work tasks',
    icon: 'briefcase',
    color: 'orange',
    tasks: [
      {
        id: uuid.v4(),
        description: 'Finish important project',
        picture: null,
      },
    ],
  },
  {
    id: uuid.v4(),
    name: 'Shopping',
    description: 'Shopping list',
    icon: 'cart',
    color: 'gray',
    tasks: [
      {
        id: uuid.v4(),
        description: 'Milk',
        picture: null,
      },
      {
        id: uuid.v4(),
        description: 'Apples',
        picture: null,
      },
    ],
  },
];

const defaultTasks = [
  {
    id: uuid.v4(),
    description:
      'Welcome to Done\n\nTap the checkbox to the left to finish this task.',
    picture: null,
  },
  {
    id: uuid.v4(),
    description:
      'Your tasks can contain links\n\nVisit https://example.com by tapping the button on the right.',
    picture: null,
  },
  {
    id: uuid.v4(),
    description:
      'Attach a photo\n\nTap and hold the plus button to create a task with a photo.',
    picture: Image.resolveAssetSource(dummyFoto),
  },
];

const initialState = {lists: [], tasksLoaded: false};

const tasksReducer = (state, action) => {
  const trimTask = task => ({
    ...task,
    description: task.description.trim(),
  });
  const trimList = list => ({
    ...list,
    name: list.name.trim(),
    description: list.description.trim(),
  });

  switch (action.type) {
    case 'create-task':
      console.debug('create-task');
      return {
        ...state,
        lists: state.lists.map(list => {
          if (list.id === action.listId) {
            return {
              ...list,
              tasks: [...list.tasks, {...trimTask(action.task), id: uuid.v4()}],
            };
          } else {
            return list;
          }
        }),
      };

    case 'update-task':
      console.debug('update-task');
      return {
        ...state,
        lists: state.lists.map(list => {
          if (list.id === action.listId) {
            return {
              ...list,
              tasks: list.tasks.map(task => {
                return task.id === action.task.id
                  ? trimTask(action.task)
                  : task;
              }),
            };
          } else {
            return list;
          }
        }),
      };

    case 'remove-task':
      console.debug(
        'remove-task listId=' + action.listId + ' taskId=' + action.taskId,
      );
      return {
        ...state,
        lists: state.lists.map(list => {
          if (list.id === action.listId) {
            const index = list.tasks.findIndex(t => t.id === action.taskId);
            const tasksCopy = [...list.tasks];
            tasksCopy.splice(index, 1);
            return {...list, tasks: tasksCopy};
          } else {
            return list;
          }
        }),
      };

    case 'init-tasks':
      console.debug('init-tasks');
      return {...state, tasks: action.tasks};

    case 'update-list':
      console.debug('update-list ' + JSON.stringify(action.list));
      if (action.list.id) {
        return {
          ...state,
          lists: state.lists.map(list => {
            return list.id === action.list.id ? trimList(action.list) : list;
          }),
        };
      } else {
        return {
          ...state,
          lists: [...state.lists, {...trimList(action.list), id: uuid.v4()}],
        };
      }

    case 'init-lists':
      console.debug('init-lists ' + JSON.stringify(action.lists));
      return {...state, lists: action.lists};

    case 'set-initialized':
      console.debug('set-initialized');
      return {...state, tasksLoaded: true};

    case 'reset-data':
      console.debug('reset-data');
      return {...state, lists: defaultLists, tasks: defaultTasks};
  }
};

const getTasks = async () => {
  try {
    const tasks = await AsyncStorage.getItem(ASYNC_STORAGE_TASKS_KEY);
    return tasks
      ? JSON.parse(tasks, (key, value) => {
          if (key === 'dueDate') {
            return new Date(value);
          } else {
            return value;
          }
        })
      : defaultTasks;
  } catch (e) {
    console.log(e);
  }
};

const getLists = async () => {
  try {
    const lists = await AsyncStorage.getItem(ASYNC_STORAGE_LIST_KEY);
    return lists ? JSON.parse(lists) : defaultLists;
  } catch (e) {
    console.log(e);
  }
};

const StorageContext = createContext(initialState);

export const Provider = ({children}) => {
  const [storage, dispatch] = useReducer(tasksReducer, initialState);

  useEffect(() => {
    const loadTasks = async () => {
      console.debug('loading tasks...');
      const tasks = await getTasks();
      dispatch({type: 'init-tasks', tasks});
    };
    const loadLists = async () => {
      console.debug('loading lists...');
      const lists = await getLists();
      dispatch({type: 'init-lists', lists});
    };

    Promise.all([loadTasks(), loadLists()]).then(
      () => {
        dispatch({type: 'set-initialized'});
      },
      () => console.error('ERROR loading tasks or lists'),
    );
  }, []);

  useEffect(() => {
    // Avoid initial writing of empty app state to storage
    if (storage.tasksLoaded) {
      console.debug('saving tasks... ');
      AsyncStorage.setItem(
        ASYNC_STORAGE_TASKS_KEY,
        JSON.stringify(storage.tasks),
      );
    }
  }, [storage.tasks, storage.tasksLoaded]);

  useEffect(() => {
    // Avoid initial writing of empty app state to storage
    if (storage.tasksLoaded) {
      console.debug('saving lists... ');
      AsyncStorage.setItem(
        ASYNC_STORAGE_LIST_KEY,
        JSON.stringify(storage.lists),
      );
    }
  }, [storage.lists, storage.tasksLoaded]);

  return (
    <StorageContext.Provider value={{storage, dispatch}}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => useContext(StorageContext);

export const createTask = (listId, task) => {
  return {type: 'create-task', listId, task};
};

export const removeTask = (listId, taskId) => {
  return {type: 'remove-task', listId, taskId};
};

export const updateList = list => {
  return {type: 'update-list', list};
};

export const resetData = () => {
  return {type: 'reset-data'};
};

export const updateTask = (listId, task) => {
  return {type: 'update-task', listId, task};
};
