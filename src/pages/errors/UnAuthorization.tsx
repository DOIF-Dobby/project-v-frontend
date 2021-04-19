import axios from 'axios';
import React, { useCallback } from 'react';
import { useMutation } from 'react-query';

function UnAuthorization() {
  const mutation = useMutation(() => axios.post('/logout'), {
    onSuccess: () => {
      window.location.href = '/';
    },
  });

  const onClickToLogin = useCallback(() => {
    mutation.mutate();
  }, [mutation]);

  return (
    <div>
      401 권한 불충분 <button onClick={onClickToLogin}>로그인 페이지로</button>
    </div>
  );
}

export default UnAuthorization;
