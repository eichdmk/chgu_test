import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Timer from '../components/Timer';
import QuestionCard from '../components/QuestionCard';
import discipline1Data from '../data/Patalogy.json';
import discipline2Data from '../data/Farmakalogy.json';
import './TestPage.css';

function TestPage() {
  const { disciplineId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [lockedQuestions, setLockedQuestions] = useState(new Set());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isQuestionLocked, setIsQuestionLocked] = useState(false);

  const disciplineNames = {
    1: 'Основы паталогии',
    2: 'Фармакалогия'
  };

  const disciplineName = disciplineNames[disciplineId] || `Дисциплина ${disciplineId}`;

  useEffect(() => {
    const disciplineData = disciplineId === '1' ? discipline1Data : discipline2Data;
    
    // Рандомизация 60 вопросов из 300
    const shuffled = [...disciplineData].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, 60);
    
    // Рандомизация вариантов ответов для каждого вопроса
    const randomizedQuestions = selectedQuestions.map(q => {
      // Фильтруем пустые варианты перед рандомизацией
      const validOptions = q.options
        .map((option, index) => ({ text: option, originalIndex: index }))
        .filter(item => item.text && item.text.trim() !== '');
      
      // Создаем массив индексов на основе реального количества вариантов
      const indices = validOptions.map((_, index) => index);
      const shuffledIndices = [...indices].sort(() => Math.random() - 0.5);
      
      // Находим новый индекс правильного ответа
      const originalCorrectIndex = validOptions.findIndex(
        item => item.originalIndex === q.correctAnswer
      );
      
      // Если правильный ответ не найден (например, был пустым), используем первый вариант
      const newCorrectAnswer = originalCorrectIndex >= 0 
        ? shuffledIndices.indexOf(originalCorrectIndex)
        : 0;
      
      // Создаем новый массив опций в случайном порядке
      const newOptions = shuffledIndices.map(i => validOptions[i].text);
      
      return {
        ...q,
        options: newOptions,
        correctAnswer: newCorrectAnswer,
        originalId: q.id
      };
    });
    
    setQuestions(randomizedQuestions);
    setQuestionStartTime(Date.now());
  }, [disciplineId]);

  const handleTimeUp = useCallback(() => {
    setIsQuestionLocked(prev => {
      if (!prev) {
        setLockedQuestions(locked => new Set([...locked, currentQuestionIndex]));
        
        // Автоматически переходим к следующему вопросу через 2 секунды
        setTimeout(() => {
          setCurrentQuestionIndex(prevIndex => {
            if (prevIndex < questions.length - 1) {
              setIsQuestionLocked(false);
              setQuestionStartTime(Date.now());
              return prevIndex + 1;
            } else {
              // Тест завершен - используем функциональное обновление для finishTest
              finishTest();
              return prevIndex;
            }
          });
        }, 2000);
        
        return true;
      }
      return prev;
    });
  }, [currentQuestionIndex, questions.length]);

  const handleAnswerSelect = (answerIndex) => {
    if (!isQuestionLocked) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: answerIndex
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsQuestionLocked(false);
      setQuestionStartTime(Date.now());
    } else {
      // Тест завершен
      finishTest();
    }
  };

  const finishTest = () => {
    // Подсчет правильных ответов
    let correctCount = 0;
    questions.forEach((question, index) => {
      // Если ответ выбран и он правильный
      if (answers[index] !== undefined && answers[index] === question.correctAnswer) {
        correctCount++;
      }
      // Если ответ не выбран или неправильный - это неправильный ответ
    });

    // Определение оценки
    let grade = 2;
    if (correctCount >= 55) grade = 5;
    else if (correctCount >= 49) grade = 4;
    else if (correctCount >= 42) grade = 3;

    // Сохранение результатов в sessionStorage
    sessionStorage.setItem('testResults', JSON.stringify({
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      wrongAnswers: questions.length - correctCount,
      grade: grade,
      answers: answers,
      questions: questions.map((q, index) => ({
        id: q.originalId,
        questionIndex: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer: answers[index]
      }))
    }));

    navigate('/results');
  };

  if (questions.length === 0) {
    return <div className="loading">Загрузка вопросов...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const hasAnswer = answers[currentQuestionIndex] !== undefined;
  const isCurrentLocked = isQuestionLocked || lockedQuestions.has(currentQuestionIndex);
  const canProceed = hasAnswer || isCurrentLocked; // Можно перейти, если есть ответ или вопрос заблокирован

  return (
    <div className="test-page">
      <div className="test-header">
        <div className="test-info">
          <h2>Тест - {disciplineName}</h2>
          <p>Вопрос {currentQuestionIndex + 1} из {questions.length}</p>
        </div>
        {!lockedQuestions.has(currentQuestionIndex) && (
          <Timer
            key={currentQuestionIndex}
            initialSeconds={60}
            onTimeUp={handleTimeUp}
          />
        )}
        {lockedQuestions.has(currentQuestionIndex) && (
          <div className="timer timer-critical">
            <span className="timer-label">Время:</span>
            <span className="timer-value">00:00</span>
          </div>
        )}
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="test-content">
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={answers[currentQuestionIndex]}
          onAnswerSelect={handleAnswerSelect}
          isLocked={isQuestionLocked || lockedQuestions.has(currentQuestionIndex)}
        />

        <div className="navigation-buttons">
          {!hasAnswer && !isCurrentLocked && (
            <p className="answer-required-message">Пожалуйста, выберите вариант ответа</p>
          )}
          <button
            className="nav-button next-button"
            onClick={handleNext}
            disabled={!canProceed}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Завершить тест' : 'Следующий →'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestPage;

