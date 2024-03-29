import axios from 'axios';
import { useCallback, useEffect, useReducer } from 'react';
import { useSetRecoilState } from 'recoil';
import { responseStatusState } from '../pages/Index';
import { loadingState } from '../components/LoadingAndDialog';
import issueAccessToken, {
  isValidAccessToken,
} from '../common/issueAccessToken';

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
      // AccessToken 만료 되었으면 재발급
      await issueAccessToken();
      const responsePageData = await axios.get(url, {
        params: {
          menuPath: window.location.pathname,
        },
      });
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
