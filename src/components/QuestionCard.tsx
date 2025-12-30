import React, { useState } from 'react';
import type { Question } from '../types';

interface QuestionCardProps {
    question: Question;
    onAnswer: (isCorrect: boolean) => void;
    onNext: () => void;
    onClose?: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    onAnswer,
    onNext,
    // onClose
}) => {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [answered, setAnswered] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleAnswer = (index: number) => {
        if (answered) return;

        setSelectedAnswer(index);
        setAnswered(true);
        const isCorrect = index === question.correctAnswer;
        onAnswer(isCorrect);
        setShowFeedback(true);
    };

    const handleNext = () => {
        onNext();
    };

    // const handleClose = () => {
    //     if (onClose) {
    //         onClose();
    //     }
    // };

    return (
        <div className="question-card">
            <div className="question-header">
                <div className="question-meta">
                    <div className="question-top">
                        <span className="question-number">Вопрос {question.id + 1} из 10</span>
                        {/* <button className="close-question-button" onClick={handleClose}>
                            ×
                        </button> */}
                    </div>
                    <div className="reward-badge">
                        <span className="badge-icon">🎁</span>
                        <span className="badge-text">Награда: {question.snowmanPart}</span>
                    </div>
                </div>
            </div>

            <div className="question-text-container">
                <div className="question-text">
                    <div className="question-decoration">
                        {/* <span className="decoration-left">❄️</span> */}
                        <p>{question.text}</p>
                        {/* <span className="decoration-right">⛄</span> */}
                    </div>
                </div>
                {/* {!answered && (
                    <div className="question-hint">
                        <span>⚠️ Выберите правильный ответ</span>
                    </div>
                )} */}
            </div>

            <div className="options-container">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        className={`option-button ${selectedAnswer === index
                            ? index === question.correctAnswer
                                ? 'correct'
                                : 'incorrect'
                            : ''
                            } ${answered && index === question.correctAnswer ? 'show-correct' : ''}`}
                        onClick={() => handleAnswer(index)}
                        disabled={answered}
                    >
                        {/* <span className="option-letter">
                            {String.fromCharCode(65 + index)}
                        </span> */}
                        <span className="option-text">{option}</span>
                        {answered && index === question.correctAnswer && (
                            <span className="option-check">✓</span>
                        )}
                        {answered && selectedAnswer === index && index !== question.correctAnswer && (
                            <span className="option-cross">✗</span>
                        )}
                    </button>
                ))}
            </div>

            {showFeedback && (
                <div className="feedback">
                    {selectedAnswer === question.correctAnswer ? (
                        <div className="feedback-correct">
                            <div className="feedback-header">
                                <span className="feedback-icon">🎉</span>
                                <div className="feedback-title">
                                    <h3>Правильно!</h3>
                                    <p className="feedback-subtitle">Отличная работа!</p>
                                </div>
                            </div>
                            <p className="feedback-message">
                                Вы заработали часть снеговика: <strong>{question.snowmanPart}</strong>
                            </p>
                            <div className="feedback-animation">
                                <span className="snowflake">❄️</span>
                                <span className="snowflake">⛄</span>
                                <span className="snowflake">✨</span>
                            </div>
                            <div className="unlocked-notice">
                                <span className="notice-icon">🔓</span>
                                <span className="notice-text">Часть разблокирована!</span>
                            </div>
                        </div>
                    ) : (
                        <div className="feedback-incorrect">
                            <div className="feedback-header">
                                <span className="feedback-icon">😢</span>
                                <div className="feedback-title">
                                    <h3>Неправильно</h3>
                                    <p className="feedback-subtitle">Не расстраивайтесь!</p>
                                </div>
                            </div>
                            <p className="feedback-message">
                                Правильный ответ: <strong>{question.options[question.correctAnswer]}</strong>
                            </p>
                            <p className="feedback-note">
                                Попробуйте ответить правильно на следующем вопросе! Кнопка появится в новом месте.
                            </p>
                        </div>
                    )}
                </div>
            )}

            <div className="navigation">
                <button
                    className="next-button"
                    onClick={handleNext}
                    disabled={!answered}
                >
                    {question.id < 9 ? (
                        <>
                            <span className="next-text">
                                Далее: Кнопка исчезнет и появится новая
                            </span>
                            <span className="next-arrow">→</span>
                        </>
                    ) : (
                        'Завершить игру'
                    )}
                </button>
                <p className="next-hint">
                    После ответа кнопка вопроса исчезнет и появится в новом случайном месте
                </p>
            </div>
        </div>
    );
};

export default QuestionCard;