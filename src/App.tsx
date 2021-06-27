import React from 'react';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from 'react-query';
import Index from './pages/Index';
import { HelmetProvider } from 'react-helmet-async';

const queryClient = new QueryClient();

function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <Index />
        </HelmetProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default App;
