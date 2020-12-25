import styles from './Navbar.module.css';

export default function Navbar({ theme }) {
    return (
      <header>
        <h1 className={styles.header} style={{ color: theme.text }}>
          TypingTest.tech
        </h1>
      </header>
    )
}