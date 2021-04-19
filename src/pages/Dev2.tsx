import axios from 'axios';
import { Loading } from 'doif-react-kit';
import React, { useCallback } from 'react';
import { useAccessToken } from '../hooks/useAccessToken';

function Dev2() {
  const { isLoading } = useAccessToken(
    useCallback(() => {
      axios
        .get('/api/resources/menus', {
          headers: {
            pageId: 3,
          },
        })
        .then((response) => console.log(response));
    }, []),
  );

  return (
    <>
      {isLoading && <Loading />}
      <div>되긴 하는데 모든 요청마다 저 것을 해줘야 하는 것인가?</div>
    </>
  );
}

export default Dev2;
