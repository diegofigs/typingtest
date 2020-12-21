import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import randomWords from 'random-words';
import { addSeconds, isBefore, isWithinInterval } from 'date-fns';

import styles from './Tester.module.css';

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

  const [events, setEvents] = useState([]);
  const [input, setInput] = useState('');
  const onKeyDown = useCallback((event) => {
    const { key, timeStamp } = event;
    setEvents(events => [...events, { key, timeStamp }]);
  }, [input, text]);

  const [startTime, setStartTime] = useState();
  useEffect(() => {
    if (input.length === 1 && !startTime) setStartTime(Date.now());
  }, [input, startTime]);

  const [wpm, setWPM] = useState();
  const [netWPM, setNetWPM] = useState();
  useEffect(() => {
    if (startTime) {
      const finishTime = (Date.now() - startTime) / 60000; // convert to minutes: 1s / 1000ms * 1m / 60s
      const grossWords = input.length / 5;
      setWPM(Math.floor(grossWords / finishTime));

      const uncorrectedErrors = input.length - computeCorrectKeys(input, text);
      setNetWPM(Math.floor((grossWords - uncorrectedErrors) / finishTime));
    }
  }, [input, text, startTime]);

  const [accuracy, setAccuracy] = useState();
  useEffect(() => {
    if (text.length !== 0 && text.length === input.length) {
      const correctKeys = computeCorrectKeys(input, text)
      setAccuracy(((correctKeys / text.length) * 100).toFixed(2));
    }
  }, [input, text]);
  useEffect(() => {
    if (accuracy) {
      const finishTime = Date.now();
      for (let interval = startTime, second = 1; isBefore(interval, finishTime); interval = addSeconds(interval, 1), second++) {
        const eventsInSlot = events.filter(({ timeStamp }) => isWithinInterval(timeStamp, { start: interval, end: addSeconds(interval, 1) }));
      }
    }
  }, [accuracy, events, startTime]);

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
          <a style={{ cursor: 'pointer' }} className={classNames({ highlight: amount === wordAmount })} onClick={() => { setWordAmount(amount); reset(amount); }}>{amount}</a>
          {index !== options.length - 1 ? ' / ' : ''}
        </Fragment>;
      })}</div>
      <span className="stats">WPM: {netWPM ? netWPM : 'XX'} ACC: {accuracy ? `${accuracy}%` : 'XX'}</span>
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
        <input disabled={input.length === text.length} className={styles.input} value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKeyDown} type="text" spellCheck="false" autoComplete="off" autoCorrect="off" autoCapitalize="off" tabIndex="0" />
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
        background-color: ${theme.highlight};
        color: ${theme.text};
        animation: blink 1s linear infinite;
        @keyframes blink {
          0% { opacity:1; }
          50% { opacity:0; }
          100% { opacity:1; }
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

function computeCorrectKeys(input, text) {
  return [...input].reduce((total, char, index) => char === text[index] ? total + 1 : total, 0);
}

function generate(wordAmount) {
  return randomWords(wordAmount).map(word => word.toLowerCase());
}
