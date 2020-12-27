import '../styles/globals.css';
import { ThemeProvider } from '@theme';
import { wrapper } from '@core/store';


function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default wrapper.withRedux(MyApp);

