import styles from './Footer.module.css';

export default function Footer () {
  return (
    <footer className={styles.footer}>
      <img src="https://madewithlove.now.sh/pr?heart=true" alt="Made with love in Puerto Rico" />
    </footer>
  );
}