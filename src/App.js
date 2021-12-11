/**
 * @format
 */

import React, {useState} from 'react';
import type {Node} from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from './screens/HomeScreen';
import GlobalDrawer from './components/GlobalDrawer';
import {Provider as StorageProvider} from './storage';
import {DefaultTheme, DarkTheme} from './theme';

const Drawer = createDrawerNavigator();

const App: () => Node = () => {
  const [isDarkTheme, setDarkTheme] = useState(useColorScheme() === 'dark');
  const toggleTheme = () => setDarkTheme(!isDarkTheme);
  const theme = isDarkTheme ? DarkTheme : DefaultTheme;

  return (
    <StorageProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <StatusBar translucent={true} backgroundColor="transparent" />
          <Drawer.Navigator
            drawerContent={props => (
              <GlobalDrawer
                {...props}
                isDarkTheme={isDarkTheme}
                toggleTheme={toggleTheme}
              />
            )}>
            <Drawer.Screen
              name="Home"
              component={HomeScreen}
              options={{headerShown: false}}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </StorageProvider>
  );
};

export default App;
