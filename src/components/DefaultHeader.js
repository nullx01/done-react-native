import React from 'react';
import {Appbar} from 'react-native-paper';
import {getHeaderTitle} from '@react-navigation/elements';
import BaseHeader from './BaseHeader';

const DefaultHeader = props => {
  return (
    <BaseHeader {...props}>
      {props.back && <Appbar.BackAction onPress={props.navigation.goBack} />}
      <Appbar.Content title={getHeaderTitle(props.options, props.route.name)} />
    </BaseHeader>
  );
};

export default DefaultHeader;
