import { useEffect, useState, useRef } from 'react';
import './Timer.css';

function Timer({ initialSeconds, onTimeUp }) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);
  const onTimeUpRef = useRef(onTimeUp);
  const hasCalledTimeUp = useRef(false);

  // Обновляем ref при изменении callback
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Сбрасываем флаг при изменении initialSeconds (новый вопрос)
  useEffect(() => {
    setSeconds(initialSeconds);
    setIsActive(true);
    hasCalledTimeUp.current = false;
  }, [initialSeconds]);

  // Отдельный эффект для вызова onTimeUp когда таймер достигает 0
  useEffect(() => {
    if (seconds === 0 && isActive && !hasCalledTimeUp.current && onTimeUpRef.current) {
      hasCalledTimeUp.current = true;
      setIsActive(false);
      // Вызываем callback в следующем тике, чтобы избежать обновления во время рендера
      setTimeout(() => {
        onTimeUpRef.current?.();
      }, 0);
    }
  }, [seconds, isActive]);

  // Основной эффект для таймера
  useEffect(() => {
    if (!isActive || seconds <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (seconds <= 10) return 'timer-critical';
    if (seconds <= 30) return 'timer-warning';
    return 'timer-normal';
  };

  return (
    <div className={`timer ${getTimerClass()}`}>
      <span className="timer-label">Время:</span>
      <span className="timer-value">{formatTime(seconds)}</span>
    </div>
  );
}

export default Timer;

