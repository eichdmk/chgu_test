import './QuestionCard.css';

function QuestionCard({ question, selectedAnswer, onAnswerSelect, isLocked, correctAnswer }) {
  const handleAnswerClick = (index) => {
    if (!isLocked) {
      onAnswerSelect(index);
    }
  };

  // Фильтруем пустые варианты и создаем массив только с валидными опциями
  const validOptions = question.options
    .map((option, index) => ({ text: option, originalIndex: index }))
    .filter(item => item.text && item.text.trim() !== '');

  // Определяем, есть ли выбранный ответ для показа обратной связи
  const hasSelectedAnswer = selectedAnswer !== undefined;

  return (
    <div className={`question-card ${isLocked ? 'locked' : ''}`}>
      <h3 className="question-text">{question.question}</h3>
      <div className="options">
        {validOptions.map((item, displayIndex) => {
          const isSelected = selectedAnswer === item.originalIndex;
          const isCorrect = item.originalIndex === correctAnswer;
          const isWrong = isSelected && !isCorrect;
          const showCorrect = hasSelectedAnswer && isCorrect;
          
          let buttonClass = 'option-button';
          if (showCorrect) {
            // Правильный ответ (выбранный или нет)
            buttonClass += ' correct';
          } else if (isWrong) {
            // Неправильный выбранный ответ
            buttonClass += ' incorrect';
          } else if (isSelected) {
            // Выбранный ответ (но еще не проверен, хотя это не должно происходить)
            buttonClass += ' selected';
          } else if (hasSelectedAnswer && isCorrect) {
            // Правильный ответ, который не был выбран
            buttonClass += ' correct-not-selected';
          }
          if (isLocked) {
            buttonClass += ' disabled';
          }

          return (
            <button
              key={item.originalIndex}
              className={buttonClass}
              onClick={() => handleAnswerClick(item.originalIndex)}
              disabled={isLocked}
            >
              {item.text}
              {showCorrect && <span className="feedback-icon">✓</span>}
              {isWrong && <span className="feedback-icon">✗</span>}
            </button>
          );
        })}
      </div>
      {hasSelectedAnswer && (
        <div className={`feedback-message ${selectedAnswer === correctAnswer ? 'correct-feedback' : 'incorrect-feedback'}`}>
          {selectedAnswer === correctAnswer 
            ? '✓ Правильный ответ!' 
            : '✗ Неправильный ответ. Правильный ответ выделен зеленым.'}
        </div>
      )}
      {isLocked && !hasSelectedAnswer && (
        <div className="locked-message">
          Время истекло. Вопрос заблокирован.
        </div>
      )}
    </div>
  );
}

export default QuestionCard;

