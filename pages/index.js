import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Tester from '../components/Tester';

export default function Home({ theme }) {
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

      <header>
        <h1 className={styles.header} style={{ color: theme.text }}>
          TypingTest.tech
        </h1>
      </header>

      <Tester theme={theme} />

      <footer className={styles.footer}>
        <img src="https://madewithlove.now.sh/pr?heart=true" alt="Made with love in Puerto Rico" />
      </footer>
    </div>
  );
}
