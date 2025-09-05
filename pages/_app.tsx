import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../lib/auth/provider';

const App = ({ Component, pageProps }: AppProps) => (
  <AuthProvider>
    <Component {...pageProps} />
  </AuthProvider>
);

export default App;
