import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const disciplines = [
    { id: 1, name: 'Основы паталогии' },
    { id: 2, name: 'Фармакалогия' }
  ];

  const handleStartTest = (disciplineId) => {
    navigate(`/test/${disciplineId}`);
  };

  return (
    <div className="home-page">
      <div className="container">
        <h1>Экзамен-тренажёр</h1>
        <p className="subtitle">Выберите дисциплину для начала теста</p>
        <div className="disciplines">
          {disciplines.map((discipline) => (
            <button
              key={discipline.id}
              className="discipline-card"
              onClick={() => handleStartTest(discipline.id)}
            >
              <h2>{discipline.name}</h2>
              <p>300 вопросов • 60 случайных вопросов в тесте</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;

