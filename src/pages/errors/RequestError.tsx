import React from 'react';
import { useRecoilValue } from 'recoil';
import { responseStatusState } from '../Index';
import UnAuthorization from './UnAuthorization';

function RequestError() {
  const requestError = useRecoilValue(responseStatusState);

  if (requestError === 401) {
    return <UnAuthorization />;
  } else {
    return null;
  }
}

export default RequestError;
