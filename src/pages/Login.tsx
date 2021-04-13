import axios from 'axios';
import {
  Button,
  Container,
  Form,
  InFormContainer,
  Input,
  Loading,
  Dialog,
  useChange,
} from 'doif-react-kit';
import React, { FormEvent, useCallback, useState } from 'react';
import { useMutation } from 'react-query';
import styled from 'styled-components';

function Login() {
  const mutation = useMutation(
    (params: Object) => axios.post('/login', params),
    {
      onSuccess: (res) => {
        axios.defaults.headers.common['Authorization'] =
          res.headers.authorization;

        console.log(axios.defaults.headers);
      },
      onError: (err) => {
        setError(true);
      },
    },
  );

  const [inputForm, onChange, resetInput] = useChange({
    id: '',
    password: '',
  });

  const [error, setError] = useState(false);

  const { id, password } = inputForm;

  const onLogin = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      mutation.mutate({ id, password });
    },
    [id, password, mutation],
  );

  const onConfirm = useCallback(() => {
    setError(() => false);
  }, []);

  return (
    <>
      {mutation.isLoading && <Loading />}
      <Dialog visible={error} type="error" onConfirm={onConfirm}>
        아이디 또는 패스워드가 일치하지 않습니다.
      </Dialog>
      <LoginContainer>
        <div>
          <h1>로그인 페이지</h1>
          <hr />
          <Form onSubmit={onLogin}>
            <Container direction="column">
              <Input
                variant="underline"
                placeholder="ID"
                value={id}
                name="id"
                onChange={onChange}
              />
              <Input
                type="password"
                variant="underline"
                placeholder="Password"
                value={password}
                name="password"
                onChange={onChange}
              />
            </Container>
            <InFormContainer align="center">
              <Button type="submit">로그인</Button>
            </InFormContainer>
          </Form>
        </div>
      </LoginContainer>
    </>
  );
}

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 600px;

  > div {
    display: flex;
    flex-direction: column;
    width: 50%;
  }
`;

export default Login;
