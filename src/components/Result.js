import React from 'react';

const Result = ({ score, total, results }) => {
    return (
      <div>
        <h2>Quiz beendet!</h2>
        <p>
          Du hast {score} von {total} Fragen richtig beantwortet.
        </p>
        <div>
          <h3>Antworten:</h3>
          {results.map((result, index) => (
            <div key={index}>
              <p>Frage: {result.question}</p>
              {result.userAnswer === "Zeit abgelaufen" ? (
                <p style={{ color: 'red' }}>Du hast diese Frage nicht beantwortet.</p>
              ) : result.userAnswer === result.correctAnswer ? (
                <p style={{ color: 'green' }}>Deine Antwort: {result.userAnswer} (Richtig)</p>
              ) : (
                <>
                  <p style={{ color: 'red' }}>Deine Antwort: {result.userAnswer} (Falsch)</p>
                  <p>Richtige Antwort: {result.correctAnswer}</p>
                </>
              )}
              <hr />
            </div>
          ))}
        </div>
        <button onClick={() => window.location.reload(false)}>
          Quiz erneut starten
        </button>
      </div>
    );
};

export default Result;
