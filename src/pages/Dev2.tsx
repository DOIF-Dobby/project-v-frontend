import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import UnAuthorization from './errors/UnAuthorization';
import { responseStatusState } from './Index';

function Dev2() {
  const setResponseStatus = useSetRecoilState(responseStatusState);

  useEffect(() => {
    axios
      .get('/api/resources/menus', {
        headers: {
          Authorization:
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImtqcG1qIiwiZXhwIjoxNjE4MjM2MzUwLCJpYXQiOjE2MTgyMzQ1NTB9.Wu2pvPplp3g6m9MKMZzwCQHTSAnEWUqa98w0vXJ2ucw',
          pageId: '3',
        },
      })
      .then((res) => {
        setResponseStatus(res.status);
      })
      .catch((err) => {
        setResponseStatus(err.response.status);
      });
  }, []);

  return <div>되긴 하는데 모든 요청마다 저 것을 해줘야 하는 것인가?</div>;
}

export default Dev2;
