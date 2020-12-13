import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Tester from '../components/Tester';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>TypingTest.tech</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2 className={styles.header}>
        TypingTest.tech
      </h2>

      <Tester />

      <div className={styles.footer}>
        <img src="https://madewithlove.now.sh/pr?heart=true" alt="Made with love in Puerto Rico" />
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.button}
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel" className={styles.logo} />
        </a>
      </div>
    </div>
  )
}
