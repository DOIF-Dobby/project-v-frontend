import axios from 'axios';
import { useCallback, useEffect, useReducer } from 'react';
import { useSetRecoilState } from 'recoil';
import { responseStatusState } from '../pages/Index';

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        data: null,
        error: null,
      };
    case 'SUCCESS':
      return {
        loading: false,
        data: action.data,
        error: null,
      };
    case 'ERROR':
      return {
        loading: false,
        data: null,
        error: action.error,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export default function usePage(url: string, onSuccess?: Function) {
  const setResponseStatus = useSetRecoilState(responseStatusState);
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: false,
  });

  const fetchPageData = useCallback(async () => {
    dispatch({ type: 'LOADING' });
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
    } catch (error) {
      setResponseStatus(error.response.status);
      dispatch({ type: 'ERROR', error });
    }
  }, [url, onSuccess, setResponseStatus]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  return [state.loading, state.data, state.error];
}
