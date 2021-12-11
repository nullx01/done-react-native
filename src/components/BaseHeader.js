import React from 'react';
import {StatusBar} from 'react-native';
import {Appbar, useTheme, withTheme} from 'react-native-paper';
import color from 'color';

const getHeaderColor = (options, fallback) => {
  return options?.headerColor
    ? options.headerColor
    : options?.color
    ? options.color
    : fallback;
};

const BaseHeader = ({options, children}) => {
  const {colors} = useTheme();

  const headerColor = getHeaderColor(options, colors.primary);
  const isDark = color(headerColor).isDark();

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Appbar.Header
        style={{backgroundColor: headerColor}}
        statusBarHeight={StatusBar.currentHeight}>
        {children}
      </Appbar.Header>
    </>
  );
};

export default withTheme(BaseHeader);
export {getHeaderColor};
