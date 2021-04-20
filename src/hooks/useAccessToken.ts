import axios from 'axios';
import { useEffect, useReducer } from 'react';
import { useSetRecoilState } from 'recoil';
import { responseStatusState } from '../pages/Index';

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        error: null,
      };
    case 'SUCCESS':
      return {
        loading: false,
        error: null,
      };
    case 'ERROR':
      return {
        loading: false,
        error: action.error,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export default function useAccessToken(onSuccess?: Function) {
  const setResponseStatus = useSetRecoilState(responseStatusState);
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    error: false,
  });

  useEffect(() => {
    dispatch({ type: 'LOADING' });

    axios
      .get('/token/access-token')
      .then((response) => {
        axios.defaults.headers.common['Authorization'] =
          response.headers.authorization;

        dispatch({ type: 'SUCCESS' });

        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((error) => {
        setResponseStatus(error.response.status);
        dispatch({ type: 'ERROR', error });
      });
  }, [onSuccess, setResponseStatus]);

  return [state.loading, state.error];
}
