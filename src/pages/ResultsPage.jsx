import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResultsPage.css';

function ResultsPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [showWrongAnswers, setShowWrongAnswers] = useState(false);

  useEffect(() => {
    const savedResults = sessionStorage.getItem('testResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    } else {
      // Если результатов нет, перенаправляем на главную
      navigate('/');
    }
  }, [navigate]);

  const handleRestart = () => {
    sessionStorage.removeItem('testResults');
    navigate('/');
  };

  if (!results) {
    return <div className="loading">Загрузка результатов...</div>;
  }

  const percentage = Math.round((results.correctAnswers / results.totalQuestions) * 100);
  const gradeColors = {
    5: '#10b981',
    4: '#3b82f6',
    3: '#f59e0b',
    2: '#ef4444'
  };

  // Находим неправильные ответы
  const wrongAnswers = results.questions.filter((q, index) => {
    return q.userAnswer === undefined || q.userAnswer !== q.correctAnswer;
  });

  return (
    <div className="results-page">
      <div className="container">
        <h1>Результаты теста</h1>
        
        <div className="results-summary">
          <div className="grade-circle" style={{ borderColor: gradeColors[results.grade] }}>
            <div className="grade-number" style={{ color: gradeColors[results.grade] }}>
              {results.grade}
            </div>
          </div>
          
          <div className="results-stats">
            <div className="stat-item">
              <span className="stat-label">Правильных ответов:</span>
              <span className="stat-value correct">{results.correctAnswers} / {results.totalQuestions}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Неправильных ответов:</span>
              <span className="stat-value wrong">{results.wrongAnswers}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Процент правильных:</span>
              <span className="stat-value">{percentage}%</span>
            </div>
          </div>
        </div>

        <div className="grade-info">
          <p>
            <strong>Система оценивания:</strong>
          </p>
          <ul>
            <li>55-60 правильных ответов = <strong>5</strong></li>
            <li>49-54 правильных ответов = <strong>4</strong></li>
            <li>42-48 правильных ответов = <strong>3</strong></li>
            <li>Меньше 42 правильных ответов = <strong>2</strong></li>
          </ul>
        </div>

        {wrongAnswers.length > 0 && (
          <div className="wrong-answers-section">
            <button 
              className="toggle-button"
              onClick={() => setShowWrongAnswers(!showWrongAnswers)}
            >
              {showWrongAnswers ? '▼' : '▶'} Показать неправильные ответы ({wrongAnswers.length})
            </button>
            
            {showWrongAnswers && (
              <div className="wrong-answers-list">
                {wrongAnswers.map((question, index) => (
                  <div key={question.id || index} className="wrong-answer-item">
                    <div className="question-header">
                      <span className="question-number">Вопрос #{question.questionIndex || index + 1}</span>
                    </div>
                    <p className="question-text">{question.question}</p>
                    
                    <div className="answers-comparison">
                      <div className="answer-option">
                        <span className="answer-label wrong-label">❌ Ваш ответ:</span>
                        <div className="answer-value wrong-answer">
                          {question.userAnswer !== undefined 
                            ? question.options[question.userAnswer] 
                            : 'Ответ не выбран'}
                        </div>
                      </div>
                      <div className="answer-option">
                        <span className="answer-label correct-label">✅ Правильный ответ:</span>
                        <div className="answer-value correct-answer">
                          {question.options[question.correctAnswer]}
                        </div>
                      </div>
                    </div>
                    
                    <div className="all-options">
                      <p className="options-title">Все варианты ответов:</p>
                      <ul className="options-list">
                        {question.options
                          .map((option, optIndex) => ({ text: option, index: optIndex }))
                          .filter(item => item.text && item.text.trim() !== '')
                          .map((item) => (
                            <li 
                              key={item.index}
                              className={`option-item ${
                                item.index === question.correctAnswer ? 'is-correct' : ''
                              } ${
                                item.index === question.userAnswer && item.index !== question.correctAnswer 
                                  ? 'is-wrong' : ''
                              }`}
                            >
                              {item.text}
                              {item.index === question.correctAnswer && ' ✓'}
                              {item.index === question.userAnswer && item.index !== question.correctAnswer && ' ✗'}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button className="restart-button" onClick={handleRestart}>
          Начать новый тест
        </button>
      </div>
    </div>
  );
}

export default ResultsPage;
