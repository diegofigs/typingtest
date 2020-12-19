import { Fragment, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import randomWords from 'random-words';

import styles from './Tester.module.css';

const options = [10, 25, 50, 100];

export default function Tester({ theme }) {
  const [wordAmount, setWordAmount] = useState(50);
  const [words, setWords] = useState([]);
  const [totalKeys, setTotalKeys] = useState(0);
  useEffect(() => {
    const generatedWords = generate(wordAmount);
    setWords(generatedWords);
    setTotalKeys(generatedWords.reduce((total, word) => total + word.length + 1, 0));
  }, []);

  const [typedWords, setTypedWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(0);
  const [correctKeys, setCorrectKeys] = useState(0);
  const [input, setInput] = useState('');
  const onKeyDown = useCallback((event) => {
    if (event.key === ' ') {
      event.preventDefault();
      console.log(input);
      const isWordCorrect = input === words[currentWord];
      setCorrectKeys(correct => correct + input.split('').reduce((total, char, i) => words[currentWord][i] === char ? total + 1 : total, isWordCorrect ? 1 : 0));
      setTypedWords(typed => ([...typed, input]));
      setCurrentWord(current => current + 1);
      setInput('');
    }
  }, [input, words, currentWord]);

  const [startTime, setStartTime] = useState();
  useEffect(() => {
    if (input.length === 1 && currentWord === 0 && !startTime) setStartTime(Date.now());
  }, [input, currentWord, startTime]);

  const [wpm, setWPM] = useState();
  useEffect(() => {
    const indexOfLatestWord = typedWords.length;
    if (indexOfLatestWord > 0) {
      const isWordCorrect = typedWords[indexOfLatestWord] === words[indexOfLatestWord];
      const totalEntries = typedWords.reduce((total, word) => total + word.length, isWordCorrect ? 1 : 0);
      const finishTime = (Date.now() - startTime) / 60000; // convert to minutes: 1s / 1000ms * 1m / 60s
      setWPM(Math.floor((totalEntries / 5) / finishTime));

      // TODO: calculate net WPM (gross wpm - uncorrected errors/min)
    }
  }, [typedWords, startTime]);

  const [accuracy, setAccuracy] = useState();
  useEffect(() => {
    if (words.length && words.length === typedWords.length) {
      setAccuracy(Math.floor((correctKeys / totalKeys) * 100));
    }
  }, [words, typedWords]);

  const reset = useCallback((amount) => {
    const generatedWords = generate(amount);
    setTypedWords([]);
    setCorrectKeys(0);
    setCurrentWord(0);
    setWords(generatedWords);
    setTotalKeys(generatedWords.reduce((total, word) => total + word.length + 1, 0));
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
      <div className="stats">Amount: {options.map((amount, index) => {
        return <Fragment key={`options-${index}`}>
          <a style={{ cursor: 'pointer' }} className={classNames({ highlight: amount === wordAmount })} onClick={() => { setWordAmount(amount); reset(amount); }}>{amount}</a>
          {index !== options.length - 1 ? ' / ' : ''}
        </Fragment>;
      })}</div>
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
          return <span key={`words-${index}`} className={textClass}>{word} </span>;
        })}
      </div>
      <div className={styles.bar}>
        <input className={inputClass} value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKeyDown} type="text" spellCheck="false" autoComplete="off" autoCorrect="off" autoCapitalize="off" tabIndex="0" />
        <button className={classNames(styles.retry, 'retry')} onClick={() => reset(wordAmount)}>Retry</button>
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
