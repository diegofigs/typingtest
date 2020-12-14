import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import randomWords from 'random-words';

import styles from './Tester.module.css';

export default function Tester({ theme }) {
  const [wordAmount, ] = useState(10);
  const [words, setWords] = useState([]);
  const [wpm, setWPM] = useState();
  const [accuracy, setAccuracy] = useState();
  useEffect(() => {
    setWords(generate(wordAmount));
  }, [wordAmount]);

  const [typedWords, setTypedWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(0);
  const [correctKeys, setCorrectKeys] = useState(0);
  const [input, setInput] = useState('');
  const onKeyDown = useCallback((event) => {
    if (event.key === ' ') {
      event.preventDefault();
      setCorrectKeys(correct => correct + input.split('').reduce((total, char, i) => words[currentWord][i] === char ? total + 1 : total, 0));
      setTypedWords(typed => ([...typed, input]));
      setCurrentWord(current => current + 1);
      setInput('');
    }
  }, [input, words, currentWord]);

  const [startTime, setStartTime] = useState();
  useEffect(() => {
    if (input.length === 1 && currentWord === 0 && !startTime) setStartTime(Date.now());
  }, [input, currentWord, startTime]);
  useEffect(() => {
    if (words.length && words.length === typedWords.length) {
      const correctWords = typedWords.filter((typed, index) => typed === words[index]);

      const finishTime = (Date.now() - startTime) / 60000; // convert to minutes: 1s / 1000ms * 1m / 60s
      const totalKeys = words.reduce((total, word) => total + word.length, 0);

      console.log(typedWords, words);
      console.log(correctKeys, totalKeys);
      setAccuracy(Math.floor((correctKeys / totalKeys) * 100));
      setWPM(Math.floor(correctWords.length / finishTime));
    }
  }, [words, typedWords]);

  const reset = useCallback(() => {
    setTypedWords([]);
    setCorrectKeys(0);
    setCurrentWord(0);
    setWords(generate(wordAmount));
    setStartTime();
    setWPM();
    setAccuracy();
    setInput('');
  });

  const inputClass = classNames(styles.input, 'input', {
    'input-wrong': input && !words[currentWord].includes(input)
  });
  return <div className={styles.root}>
    <div className={styles.bar}>
      <span className="stats">Amount: {wordAmount}</span>
      <span className="stats">WPM: {wpm ? wpm : 'XX'} ACC: {accuracy ? accuracy : 'XX'}</span>
    </div>
    <div className={classNames(styles.area, 'area')}>
      <div className={styles.display}>
        {words.length && words.map((word, index) => {
          const isCurrent = index === currentWord;
          const isTyped = index < currentWord;
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
        <button className={classNames(styles.retry, 'retry')} onClick={() => reset()}>Retry</button>
      </div>
    </div>
    <style jsx>{`
      .stats {
        color: ${theme.text};
      }
      .area {
        background: ${theme.background.light};
        color: ${theme.text};
      }
      .input {
        background: ${theme.background.main};
        color: ${theme.text};
      }
      .input-wrong {
        background: ${theme.background.error}
      }
      .highlight {
        color: ${theme.highlight};
      }
      .correct {
        color: ${theme.correct};
      }
      .wrong {
        color: ${theme.wrong};
      }
      .retry {
        background: ${theme.background.retry};
        color: ${theme.text};
      }
    `}</style>
  </div>
}

function generate(wordAmount) {
  return randomWords(wordAmount).map(word => word.toLowerCase());
}
