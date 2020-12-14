import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Tester from '../components/Tester';

export default function Home({ theme }) {
  return (
    <div className={styles.container} style={{ background: theme.background.main }}>
      <Head>
        <title>TypingTest.tech</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2 className={styles.header} style={{ color: theme.text }}>
        TypingTest.tech
      </h2>

      <main>
        <Tester theme={theme} />
      </main>

      <footer className={styles.footer}>
        <img src="https://madewithlove.now.sh/pr?heart=true" alt="Made with love in Puerto Rico" />
      </footer>
    </div>
  );
}
