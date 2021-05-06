import axios from 'axios';
import { Container } from 'doif-react-kit';
import { useReducer } from 'react';
import { useSetRecoilState } from 'recoil';
import { dialogState, loadingState } from '../components/LoadingAndDialog';

/**
 * post 요청 시 사용
 * @param url 요청 url
 * @param data request body에 넣을 데이터
 * @param params request url 매개 변수
 * @param headers request header에 넣을 데이터
 * @returns
 */
export async function postAction(
  url: string,
  data?: Object,
  params?: Object,
  headers?: Object,
) {
  const response = await axios.post(url, data, {
    params: params,
    headers: headers,
  });
  return response.data;
}

/**
 * put 요청 시 사용
 * @param url 요청 url
 * @param data request body에 넣을 데이터
 * @param params request url 매개 변수
 * @param headers request header에 넣을 데이터
 * @returns
 */
export async function putAction(
  url: string,
  data?: Object,
  params?: Object,
  headers?: Object,
) {
  const response = await axios.put(url, data, {
    params: params,
    headers: headers,
  });
  return response.data;
}

/**
 * get 요청 시 사용
 * @param url 요청 url
 * @param params request url 매개 변수
 * @param headers request header에 넣을 데이터
 * @param data request body에 넣을 데이터
 * @returns
 */
export async function deleteAction(
  url: string,
  params?: Object,
  headers?: Object,
  data?: Object,
) {
  const response = await axios.delete(url, {
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

export type AsyncActionTypes = {
  /** 비동기 요청 성공 시 콜백 */
  onSuccess?: (data: any) => void;
  /** 비동기 요청 실패 시 콜백 */
  onError?: (data: any) => void;
};

function useAsyncAction(callback: Function, options?: AsyncActionTypes) {
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    error: null,
  });

  const onSuccess = options?.onSuccess;
  const onError = options?.onError;

  const { data } = state;

  const setLoading = useSetRecoilState(loadingState);
  const setDialog = useSetRecoilState(dialogState);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await callback();
      dispatch({ type: 'SUCCESS', data });
      setLoading(false);

      setDialog(() => ({
        visible: true,
        type: 'success',
        content: data.message,
      }));

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      dispatch({ type: 'ERROR', error });
      setLoading(false);

      if (onError) {
        onError(error.response);
      }

      console.log(error.response);

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

  return [fetchData, data];
}

export default useAsyncAction;
