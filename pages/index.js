import Head from 'next/head';

import styles from '../styles/Home.module.css';
import { Footer, Navbar, Tester } from 'components';
import { useTheme } from '@theme';

export default function Home() {
  const theme = useTheme();
  return (
    <div className={styles.container} style={{ background: theme.background.main }}>
      <Head>
        <title>TypingTest.tech</title>
        <link rel="icon" href="/favicon.ico" />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
              `,
          }}
        />
      </Head>

      <Navbar theme={theme} />
      <Tester theme={theme} />
      <Footer />
    </div>
  );
}
