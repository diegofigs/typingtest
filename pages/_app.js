import '../styles/globals.css';
import theme from '../themes/dark';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} theme={theme}/>
}

export default MyApp
