import axios from 'axios';
import { useCallback, useEffect, useReducer } from 'react';
import { useSetRecoilState } from 'recoil';
import { responseStatusState } from '../pages/Index';
import { loadingState } from '../pages/Main';

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'SUCCESS':
      return {
        data: action.data,
        error: null,
      };
    case 'ERROR':
      return {
        data: null,
        error: action.error,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export default function usePage(url: string, onSuccess?: Function) {
  const setResponseStatus = useSetRecoilState(responseStatusState);
  const setLoading = useSetRecoilState(loadingState);
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    error: false,
  });

  const fetchPageData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/token/access-token');

      axios.defaults.headers.common['Authorization'] =
        response.headers.authorization;

      const responsePageData = await axios.get(url);
      axios.defaults.headers.common['pageId'] = responsePageData.data.pageId;

      if (onSuccess) {
        onSuccess();
      }

      dispatch({ type: 'SUCCESS', data: responsePageData.data });
      setLoading(false);
    } catch (error) {
      setResponseStatus(error.response.status);
      dispatch({ type: 'ERROR', error });
      setLoading(false);
    }
  }, [url, onSuccess, setResponseStatus, setLoading]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  return [state.data, state.error];
}
