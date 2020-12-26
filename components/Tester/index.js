import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import randomWords from 'random-words';

import styles from './Tester.module.css';
import { useInterval, useFocus } from '@hooks';
import { calculateWPM, calculateNetWPM, calculateAccuracy, calculateCorrectKeys } from '@core/equations';

const options = [10, 25, 50, 100];

export default function Tester({ theme }) {
  const [wordAmount, setWordAmount] = useState(50);
  const [words, setWords] = useState([]);
  useEffect(() => {
    const generatedWords = generate(wordAmount);
    setWords(generatedWords);
  }, []);
  const text = useMemo(() => {
    return words.join(' ');
  }, [words]);

  const [inputRef, setFocus] = useFocus();
  useEffect(setFocus, [inputRef.current]);

  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState();
  useEffect(() => {
    if (input.length === 1 && !startTime) setStartTime(Date.now());
  }, [input, startTime]);
  
  const [, setWPM] = useState();
  const [netWPM, setNetWPM] = useState();
  const [accuracy, setAccuracy] = useState();
  useEffect(() => {
    if (text.length !== 0 && text.length === input.length) {
      const finishTime = Date.now();
      setWPM(calculateWPM(input, startTime, finishTime));
      setNetWPM(calculateNetWPM(input, text, startTime, finishTime));
      setAccuracy((calculateAccuracy(input, text)).toFixed(2));
    }
  }, [input, text, startTime]);

  const [events, setEvents] = useState([]);
  useInterval(() => {
    const t = Date.now();
    const raw = calculateWPM(input, startTime, t);
    const wpm = calculateNetWPM(input, text, startTime, t);
    const errors = input.length - calculateCorrectKeys(input, text);
    const stats = { t, wpm, errors, raw };
    setEvents(events => [...events, stats]);
  }, startTime && !accuracy ? 1000 : null);
  useEffect(() => {
    if (accuracy) {
      const finishTime = Date.now();
    }
  }, [accuracy, events]);

  const reset = useCallback((amount) => {
    const generatedWords = generate(amount);
    setWords(generatedWords);
    setStartTime();
    setWPM();
    setNetWPM();
    setAccuracy();
    setInput('');
  });

  return <div className={styles.root}>
    <div className={styles.bar}>
      <div className="stats">Amount: {options.map((amount, index) => {
        return <Fragment key={`options-${index}`}>
          <a style={{ cursor: 'pointer' }} className={classNames({ highlight: amount === wordAmount })} onClick={() => { setWordAmount(amount); reset(amount); setFocus(); }}>{amount}</a>
          {index !== options.length - 1 ? ' / ' : ''}
        </Fragment>;
      })}</div>
      <span className="stats">WPM: {netWPM ? netWPM : 'XX'} ACC: {accuracy ? `${accuracy} %` : 'XX'}</span>
    </div>
    <div className={classNames(styles.area, 'area')}>
      <div className={styles.display}>
        {text.split('').map((char, index) => {
          const isCurrent = input.length === index;
          const isTyped = input.length > index;
          const isCorrect = isTyped && text[index] === input[index];
          const isWrong = isTyped && text[index] !== input[index];
          const textClass = classNames({
            highlight: isCurrent,
            blinking: isCurrent,
            correct: isCorrect,
            wrong: isWrong
          });
          return (<Fragment key={`char-${index}`}>
            <span className={textClass}>{char}</span>
          </Fragment>)
        })}
      </div>
      <div className={styles.bar}>
        <input ref={inputRef} disabled={input.length === text.length} className={styles.input} value={input} onChange={e => setInput(e.target.value)} type="text" spellCheck="false" autoComplete="off" autoCorrect="off" autoCapitalize="off" />
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
        opacity: 1;
      }
      .blinking {
        border-left: 1px solid transparent;
        color: ${theme.text};
        animation: blink 1.5s cubic-bezier(.215, .61, .355, 1) forwards infinite;
        @keyframes blink {
          50% { border-color: ${theme.highlight}; }
        }
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
