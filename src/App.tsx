import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { GlobalStyle, theme } from 'doif-react-kit';
import 'doif-react-kit/dist/doif-react-kit.css';
import Main from './pages/Main';
import Login from './pages/Login';
import { ThemeProvider } from 'styled-components';

const queryClient = new QueryClient();

function App() {
  const jwtToken = localStorage.getItem('jwtToken');

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />
      <ThemeProvider theme={theme['light']}>
        {jwtToken ? <Main /> : <Login />}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
