import axios from 'axios';
import { useEffect, useReducer } from 'react';
import { useSetRecoilState } from 'recoil';
import { responseStatusState } from '../pages/Index';
import { loadingState } from '../components/LoadingAndDialog';

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
  const setLoading = useSetRecoilState(loadingState);
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    error: false,
  });

  useEffect(() => {
    dispatch({ type: 'LOADING' });
    setLoading(true);

    axios
      .get('/token/access-token')
      .then((response) => {
        axios.defaults.headers.common['Authorization'] =
          response.headers.authorization;

        dispatch({ type: 'SUCCESS' });
        setLoading(false);

        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((error) => {
        setResponseStatus(error.response.status);
        dispatch({ type: 'ERROR', error });
        setLoading(false);
      });
  }, [onSuccess, setResponseStatus, setLoading]);

  return [state.loading, state.error];
}
