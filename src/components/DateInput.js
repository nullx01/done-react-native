import React, {useState} from 'react';
import {Platform, Pressable} from 'react-native';
import {TextInput} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateInput = ({editable, mode, value, label, onChangeDate}) => {
  const [visible, setVisible] = useState(false);

  const changeDate = (event, selectedDate) => {
    setVisible(Platform.OS === 'ios');
    if (selectedDate) {
      onChangeDate(selectedDate);
    }
  };

  const openPicker = () => setVisible(true);

  const textDate =
    value instanceof Date ? value : value ? new Date(value) : value;
  const pickerDate = textDate || new Date();

  return (
    <>
      <Pressable disabled={!editable} onPress={openPicker}>
        <TextInput
          mode={mode}
          label={label}
          editable={false}
          value={textDate ? textDate.toLocaleDateString() : null}
          right={
            <TextInput.Icon
              name="calendar"
              onPress={openPicker}
              disabled={!editable}
              forceTextInputFocus={false}
            />
          }
        />
      </Pressable>
      {visible && (
        <DateTimePicker value={pickerDate} mode="date" onChange={changeDate} />
      )}
    </>
  );
};

export default DateInput;
