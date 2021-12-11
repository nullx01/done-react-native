import React from 'react';
import {Dialog, Paragraph, Portal, Button} from 'react-native-paper';

const ClearConfirmationDialog = ({visible, onConfirm, onDismiss}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Content>
          <Paragraph>
            Do you want to permanently delete all your tasks and restore the
            initial example tasks?
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>No</Button>
          <Button onPress={onConfirm}>Yes</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ClearConfirmationDialog;
