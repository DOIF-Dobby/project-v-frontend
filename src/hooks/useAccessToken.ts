import { useEffect, useReducer } from 'react';
import { useSetRecoilState } from 'recoil';
import issueAccessToken from '../common/issueAccessToken';
import { loadingState } from '../components/LoadingAndDialog';
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
  const setLoading = useSetRecoilState(loadingState);
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    error: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'LOADING' });
      setLoading(true);

      try {
        // AccessToken 만료 되었으면 재발급
        await issueAccessToken();

        dispatch({ type: 'SUCCESS' });
        setLoading(false);

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        setResponseStatus(error.response.status);
        dispatch({ type: 'ERROR', error });
        setLoading(false);
      }
    };

    fetchData();
  }, [onSuccess, setResponseStatus, setLoading]);

  return [state.loading, state.error];
}
