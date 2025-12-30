import React from 'react';

interface GameProgressProps {
    currentQuestion: number;
    totalQuestions: number;
    unlockedParts: number[];
    score: number;
    buttonFound?: boolean;
    onReset?: () => void;
}

const GameProgress: React.FC<GameProgressProps> = ({
    currentQuestion,
    totalQuestions,
    unlockedParts,
    score,
    buttonFound = false,
    onReset
}) => {
    const progress = ((currentQuestion) / totalQuestions) * 100;
    const buttonProgress = ((currentQuestion + (buttonFound ? 1 : 0)) / totalQuestions) * 100;

    return (
        <div className="game-progress">
            <div className="progress-header">
                <h3>Прогресс игры</h3>
                {onReset && (
                    <button
                        className="reset-mini-button"
                        onClick={onReset}
                        title="Сбросить прогресс"
                    >
                        🔄
                    </button>
                )}
            </div>

            <div className="progress-stats">
                <div className="stat">
                    <span className="stat-label">Вопрос:</span>
                    <span className="stat-value">{currentQuestion + 1}/{totalQuestions}</span>
                </div>
                <div className="stat">
                    <span className="stat-label">Счет:</span>
                    <span className="stat-value">{score}</span>
                </div>
                <div className="stat">
                    <span className="stat-label">Части:</span>
                    <span className="stat-value">{unlockedParts.length}/10</span>
                </div>
                <div className="stat">
                    <span className="stat-label">Кнопка:</span>
                    <span className={`stat-value ${buttonFound ? 'found' : 'hidden'}`}>
                        {buttonFound ? '✅' : '🔍'}
                    </span>
                </div>
            </div>

            <div className="progress-bars">
                <div className="progress-section">
                    <div className="progress-label">
                        <span>Прогресс вопросов</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar question-progress"
                            style={{ width: `${progress}%` }}
                        >
                            <span className="progress-text">{Math.round(progress)}%</span>
                        </div>
                    </div>
                </div>

                <div className="progress-section">
                    <div className="progress-label">
                        <span>Кнопки найдены</span>
                        <span>{currentQuestion + (buttonFound ? 1 : 0)}/10</span>
                    </div>
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar button-progress"
                            style={{ width: `${buttonProgress}%` }}
                        >
                            <span className="progress-text">
                                {currentQuestion + (buttonFound ? 1 : 0)}/10
                            </span>
                        </div>
                    </div>
                </div>

                <div className="progress-section">
                    <div className="progress-label">
                        <span>Снеговик собран</span>
                        <span>{unlockedParts.length}/10</span>
                    </div>
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar snowman-progress"
                            style={{ width: `${(unlockedParts.length / totalQuestions) * 100}%` }}
                        >
                            <span className="progress-text">{unlockedParts.length}/10</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameProgress;