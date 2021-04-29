import axios from 'axios';
import { Container } from 'doif-react-kit';
import { useEffect, useReducer } from 'react';
import { useSetRecoilState } from 'recoil';
import { dialogState, loadingState } from '../components/LoadingAndDialog';

/**
 * get 요청 시 사용
 * @param url 요청 url
 * @param params request url 매개 변수
 * @param headers request header에 넣을 데이터
 * @param data request body에 넣을 데이터
 * @returns
 */
export async function getAction(
  url: string,
  params?: Object,
  headers?: Object,
  data?: Object,
) {
  const response = await axios.get(url, {
    headers: headers,
    params: params,
    data: data,
  });
  return response.data;
}

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

function useAsyncGet(callback: Function, deps: Array<any> = [], skip = false) {
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    error: null,
  });

  const { data } = state;

  const setLoading = useSetRecoilState(loadingState);
  const setDialog = useSetRecoilState(dialogState);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await callback();
      dispatch({ type: 'SUCCESS', data });
      setLoading(false);
    } catch (error) {
      dispatch({ type: 'ERROR', error });
      setLoading(false);

      setDialog(() => ({
        visible: true,
        type: 'error',
        content: (
          <Container direction="column">
            <div>오류가 발생하였습니다.</div>
            <div>오류코드: {error.response.status}</div>
            <div>오류메세지: {error.response.statusText}</div>
          </Container>
        ),
      }));
    }
  };

  useEffect(() => {
    if (skip) return;
    fetchData();
    // eslint 설정을 다음 줄에서만 비활성화
    // eslint-disable-next-line
  }, deps);

  return [data, fetchData];
}

export default useAsyncGet;
