import { Container } from 'doif-react-kit';
import { useEffect, useReducer } from 'react';
import { useSetRecoilState } from 'recoil';
import { dialogState, loadingState } from '../pages/Main';

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

function useAsync(callback: Function, deps: Array<any> = [], skip = false) {
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    error: null,
  });

  const setLoading = useSetRecoilState(loadingState);
  const setDialog = useSetRecoilState(dialogState);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await callback();
      dispatch({ type: 'SUCCESS', data });
      setLoading(false);

      if (skip) {
        setDialog(() => ({
          visible: true,
          type: 'success',
          content: '정상적으로 처리되었습니다.',
        }));
      }
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

  return [state, fetchData];
}

export default useAsync;
