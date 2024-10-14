import React, { useState, useEffect } from 'react';
import axios from 'axios';
import he from 'he'; 
import Question from './Question';
import Result from './Result';

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizOver, setIsQuizOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); 
  const [userAnswers, setUserAnswers] = useState([]); 

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('https://opentdb.com/api.php?amount=5&type=multiple');
        const questionsWithShuffledAnswers = response.data.results.map(question => {
          const shuffledAnswers = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);
          return {
            ...question,
            question: he.decode(question.question), 
            shuffledAnswers: shuffledAnswers.map(answer => he.decode(answer)) 
          };
        });
        setQuestions(questionsWithShuffledAnswers);
      } catch (error) {
        console.error('Fehler beim Laden der Fragen:', error);
      }
    };
    fetchQuestions();
  }, []);

  
  useEffect(() => {
    if (timeLeft === 0) {
      handleTimeUp(); 
      return;
    }

    if (isQuizOver) {
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isQuizOver]);

  const handleAnswer = (userAnswer) => {
    const isCorrect = userAnswer === questions[currentQuestionIndex].correct_answer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        question: questions[currentQuestionIndex].question,
        userAnswer: userAnswer,
        correctAnswer: questions[currentQuestionIndex].correct_answer,
      },
    ]);

    goToNextQuestion();
  };

  const handleTimeUp = () => {
    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        question: questions[currentQuestionIndex].question,
        userAnswer: "Zeit abgelaufen", 
        correctAnswer: questions[currentQuestionIndex].correct_answer,
      },
    ]);
    goToNextQuestion();
  };

  const goToNextQuestion = () => {
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setTimeLeft(10); 
    } else {
      setIsQuizOver(true); 
    }
  };


  if (isQuizOver) {
    return <Result score={score} total={questions.length} results={userAnswers} />;
  }

  return (
    <div>
      {questions.length > 0 ? (
        <>
          <Question
            data={{ ...questions[currentQuestionIndex], answers: questions[currentQuestionIndex].shuffledAnswers }}
            handleAnswer={handleAnswer}
          />
          <p>Zeit verbleibend: {timeLeft} Sekunden</p>
          <p>Frage {currentQuestionIndex + 1} von {questions.length}</p>
        </>
      ) : (
        <p>Fragen werden geladen...</p>
      )}
    </div>
  );
};

export default QuizApp;
