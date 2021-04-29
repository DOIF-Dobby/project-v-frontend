import { Dialog, Loading } from 'doif-react-kit';
import React, { useCallback } from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

export type DialogProps = {
  visible: boolean;
  type?: 'success' | 'warning' | 'error' | 'info';
  content: React.ReactNode;
};

export const loadingState = atom({
  key: 'loadingState',
  default: false,
});

export const dialogState = atom<DialogProps>({
  key: 'dialogState',
  default: {
    visible: false,
    type: 'info',
    content: '',
  },
});

function LoadingAndDialog() {
  const loading = useRecoilValue(loadingState);
  const [dialog, setDialog] = useRecoilState(dialogState);

  const onCloseDialog = useCallback(
    () => setDialog((data) => ({ ...data, visible: false })),
    [setDialog],
  );

  return (
    <>
      {loading && <Loading />}
      <Dialog
        visible={dialog.visible}
        type={dialog.type}
        onConfirm={onCloseDialog}
      >
        {dialog.content}
      </Dialog>
    </>
  );
}

export default React.memo(LoadingAndDialog);
