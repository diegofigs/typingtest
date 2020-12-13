import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import faker from 'faker';

import styles from './Tester.module.css';

export default function Tester() {
  const [wordAmount, ] = useState(50);
  const [words, setWords] = useState([]);
  useEffect(() => {
    setWords(new Array(wordAmount).fill().map(_ => faker.random.word().toLowerCase()));
  }, [wordAmount]);

  const [typedWords, setTypedWords] = useState([]);
  const [wordCount, setWordCount] = useState(0);

  const [input, setInput] = useState('');
  const onKeyDown = useCallback((event) => {
    if (event.key === ' ') {
      event.preventDefault();
      setTypedWords(typed => ([...typed, input]));
      setWordCount(count => count + 1);
      setInput('');
    }
  }, [input]);

  const inputClass = classNames({
    [styles.input]: true,
    'input-wrong': input && !words[wordCount].includes(input)
  });
  return <div className={styles.root}>
    <div className={classNames(styles.area, 'area')}>
      <div className={styles.display}>
        {words.length && words.map((word, index) => {
          const isCurrent = index === wordCount;
          const isTyped = index < wordCount;
          const isCorrect = isTyped && words[index] === typedWords[index];
          const isWrong = isTyped && words[index] !== typedWords[index];
          const textClass = classNames({
            highlight: isCurrent,
            correct: isCorrect,
            wrong: isWrong
          });
          return <span key={index} className={textClass}>{word} </span>;
        })}
      </div>
      <div className={styles.bar}>
        <input className={inputClass} value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKeyDown} type="text" spellCheck="false" autoComplete="off" autoCorrect="off" autoCapitalize="off" tabIndex="0" />
        <button className={classNames(styles['retry-btn'], 'retry')} onClick={() => setWords([...words].map(_ => faker.random.word().toLowerCase()))}>Retry</button>
      </div>
      <style jsx>{`
        .area {
          background: #eaeaea;
        }
        .input-wrong {
          background: rgba(198, 38, 46, 0.3)
        }
        .highlight {
          color: #a56de2;
        }
        .correct {
          color: #68b723;
        }
        .wrong {
          color: #c6262e;
        }
        .retry {
          background: #d4d4d4;
          color: #1a1a1a;
        }
      `}</style>
    </div>
  </div>
}