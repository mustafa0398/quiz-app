import React from 'react';
import he from 'he'; 

const Question = ({ data, handleAnswer }) => {
  const { question, shuffledAnswers } = data;

  return (
    <div>
      <h2 dangerouslySetInnerHTML={{ __html: he.decode(question) }} /> 
      {shuffledAnswers.map((answer, index) => (
        <button
          key={index}
          onClick={() => handleAnswer(answer)}
          dangerouslySetInnerHTML={{ __html: he.decode(answer) }} 
        />
      ))}
    </div>
  );
};

export default Question;
