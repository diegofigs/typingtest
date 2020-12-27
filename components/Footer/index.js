import classNames from 'classnames';
import styles from './Footer.module.css';

export default function Footer ({ theme }) {
  return (
    <footer className={classNames(styles.footer, 'footer')}>
      <img src="https://madewithlove.now.sh/pr?heart=true" alt="Made with love in Puerto Rico" />
      <div>
        Icons made by <a href="https://www.flaticon.com/authors/smalllikeart" title="smalllikeart">smalllikeart</a> and <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
      </div>
      <style jsx>{`
        .footer {
          color: ${theme.text};
        }
        a:hover {
          color: ${theme.highlight}
        }
      `}</style>
    </footer>
  );
}