import './QuestionCard.css';

function QuestionCard({ question, selectedAnswer, onAnswerSelect, isLocked }) {
  const handleAnswerClick = (index) => {
    if (!isLocked) {
      onAnswerSelect(index);
    }
  };

  // Фильтруем пустые варианты и создаем массив только с валидными опциями
  const validOptions = question.options
    .map((option, index) => ({ text: option, originalIndex: index }))
    .filter(item => item.text && item.text.trim() !== '');

  return (
    <div className={`question-card ${isLocked ? 'locked' : ''}`}>
      <h3 className="question-text">{question.question}</h3>
      <div className="options">
        {validOptions.map((item, displayIndex) => {
          const isSelected = selectedAnswer === item.originalIndex;
          return (
            <button
              key={item.originalIndex}
              className={`option-button ${
                isSelected ? 'selected' : ''
              } ${isLocked ? 'disabled' : ''}`}
              onClick={() => handleAnswerClick(item.originalIndex)}
              disabled={isLocked}
            >
              {item.text}
            </button>
          );
        })}
      </div>
      {isLocked && (
        <div className="locked-message">
          Время истекло. Вопрос заблокирован.
        </div>
      )}
    </div>
  );
}

export default QuestionCard;

