import /*React,*/ { useState, useEffect, useCallback, useRef } from 'react';
import Snowman from './components/Snowman';
import QuestionCard from './components/QuestionCard';
import GameProgress from './components/GameProgress';
import Modal from './components/Modal';
import ResetModal from './components/ResetModal';
import { questions } from './data/questions';
// import type { SnowmanPart } from './types';

function App() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [unlockedParts, setUnlockedParts] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [showSnowman, setShowSnowman] = useState(false);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
    const [showQuestionButton, setShowQuestionButton] = useState(true);
    const [buttonFound, setButtonFound] = useState(false);
    const [animationDelay, setAnimationDelay] = useState(0);

    const isInitializedRef = useRef(false);
    const resizeTimeoutRef = useRef<number | null>(null);

    // Функция сброса игры
    const resetGame = useCallback((fullReset: boolean = true) => {
        if (fullReset) {
            // Полный сброс игры
            setCurrentQuestion(0);
            setUnlockedParts([]);
            setScore(0);
            setGameCompleted(false);
            setShowSnowman(false);
            setShowQuestionModal(false);
            setShowResetModal(false);
        }

        // Сброс состояния кнопки
        setShowQuestionButton(true);
        setButtonFound(false);

        // Обновление положения кнопки
        const timer = setTimeout(() => {
            const buttonWidth = 200;
            const buttonHeight = 60;
            const padding = 20;

            const maxX = window.innerWidth - buttonWidth - padding;
            const maxY = window.innerHeight - buttonHeight - padding;

            setButtonPosition({
                x: padding + Math.floor(Math.random() * maxX),
                y: padding + Math.floor(Math.random() * maxY)
            });
            setAnimationDelay(Math.random() * 2);
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    // Используем useCallback для мемоизации функции
    const updateButtonPosition = useCallback(() => {
        // Учитываем отступы и размер кнопки
        const buttonWidth = 100;
        const buttonHeight = 60;
        const padding = 20;

        // const maxX = window.innerWidth - buttonWidth - padding;
        // const maxY = window.innerHeight - buttonHeight - padding;
        const maxX = (window.innerWidth * 0.5) - buttonWidth - padding;
        const maxY = (window.innerHeight * 0.9) - buttonHeight - padding;

        const randomX = padding + Math.floor(Math.random() * maxX);
        const randomY = padding + Math.floor(Math.random() * maxY);

        requestAnimationFrame(() => {
            setButtonPosition({ x: randomX, y: randomY });
            setAnimationDelay(Math.random() * 2);
        });
    }, []);

    // Инициализация при первом рендере
    useEffect(() => {
        if (!isInitializedRef.current) {
            isInitializedRef.current = true;
            const timer = setTimeout(() => {
                resetGame(false); // Только сброс кнопки без сброса прогресса
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [resetGame]);

    // Сброс состояния кнопки при переходе на новый вопрос
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!showQuestionModal) {
                updateButtonPosition();
                setShowQuestionButton(true);
                setButtonFound(false);
            }
        }, 10);

        return () => clearTimeout(timer);
    }, [currentQuestion, showQuestionModal, updateButtonPosition]);

    // Обновляем положение кнопки при изменении размера окна
    useEffect(() => {
        const handleResize = () => {
            if (resizeTimeoutRef.current !== null) {
                clearTimeout(resizeTimeoutRef.current);
            }

            resizeTimeoutRef.current = window.setTimeout(() => {
                if (showQuestionButton) {
                    updateButtonPosition();
                }
            }, 100);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (resizeTimeoutRef.current !== null) {
                clearTimeout(resizeTimeoutRef.current);
            }
        };
    }, [showQuestionButton, updateButtonPosition]);

    const handleAnswer = useCallback((isCorrect: boolean) => {
        if (isCorrect) {
            setScore(prevScore => prevScore + 1);

            // Разблокируем часть снеговика
            setUnlockedParts(prevParts => {
                if (!prevParts.includes(currentQuestion)) {
                    return [...prevParts, currentQuestion];
                }
                return prevParts;
            });
        }
    }, [currentQuestion]);

    const handleNextQuestion = useCallback(() => {
        setShowQuestionModal(false);

        const timer = setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
            } else {
                setGameCompleted(true);
            }
        }, 10);

        return () => clearTimeout(timer);
    }, [currentQuestion]);

    const handleRandomButtonClick = useCallback(() => {
        const timer = setTimeout(() => {
            setShowQuestionModal(true);
            setShowQuestionButton(false);
            setButtonFound(true);
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    // const handleFindNewButton = useCallback(() => {
    //     const timer = setTimeout(() => {
    //         updateButtonPosition();
    //         setShowQuestionButton(true);
    //         setButtonFound(false);
    //     }, 0);

    //     return () => clearTimeout(timer);
    // }, [updateButtonPosition]);

    // const handleHintClick = useCallback(() => {
    //     const hintBox = document.querySelector('.hint-box');
    //     if (hintBox) {
    //         hintBox.classList.add('highlight');
    //         setTimeout(() => hintBox.classList.remove('highlight'), 1000);
    //     }
    // }, []);

    // const handleMoveButton = useCallback(() => {
    //     const timer = setTimeout(() => updateButtonPosition(), 0);
    //     return () => clearTimeout(timer);
    // }, [updateButtonPosition]);

    const handleResetProgress = () => {
        setShowResetModal(true);
    };

    const confirmReset = () => {
        resetGame(true);
        setShowResetModal(false);
    };

    const cancelReset = () => {
        setShowResetModal(false);
    };

    if (gameCompleted) {
        return (
            <div className="app">
                <div className="completion-screen">
                    <h1>🎉 Поздравляем! 🎉</h1>
                    <p>Вы набрали {score} из {questions.length} баллов!</p>
                    <p>Снеговик собран на {(unlockedParts.length / questions.length * 100).toFixed(0)}%</p>

                    <div className="buttons">
                        <button
                            className="btn-primary"
                            onClick={() => {
                                const timer = setTimeout(() => setShowSnowman(true), 0);
                                return () => clearTimeout(timer);
                            }}
                        >
                            Посмотреть снеговика
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => resetGame(true)}
                        >
                            Играть снова
                        </button>
                        <button
                            className="btn-reset"
                            onClick={handleResetProgress}
                        >
                            Сбросить прогресс
                        </button>
                    </div>

                    {showSnowman && (
                        <div className="snowman-preview">
                            <Snowman unlockedParts={unlockedParts} />
                            <div className="completion-stats">
                                <h3>📊 Статистика игры:</h3>
                                <div className="stats-grid">
                                    <div className="stat-item">
                                        <span className="stat-label">Найдено кнопок:</span>
                                        <span className="stat-value">{buttonFound ? currentQuestion + 1 : currentQuestion}/10</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Правильных ответов:</span>
                                        <span className="stat-value">{score}/10</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Частей снеговика:</span>
                                        <span className="stat-value">{unlockedParts.length}/10</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <header>
                <div className="header-top">
                    <h1>❄️ Собери Снеговика ❄️</h1>
                    <button
                        className="reset-progress-button"
                        onClick={handleResetProgress}
                        title="Сбросить прогресс"
                    >
                        🔄 Сбросить
                    </button>
                </div>
                {/* <p>Ответьте на вопросы, чтобы собрать снеговика!</p> */}
                <p className="game-instruction">
                    <strong>Как играть:</strong> Найдите на странице кнопку с вопросом ❓,
                    нажмите на неё и ответьте правильно, чтобы получить часть снеговика!
                </p>
                {/* <div className="current-question-info">
                    <span className="question-counter">
                        Вопрос: <strong>{currentQuestion + 1}</strong> из {questions.length}
                    </span>
                    <span className="button-status">
                        Статус кнопки:
                        <strong className={showQuestionButton ? "status-visible" : "status-hidden"}>
                            {showQuestionButton ? " 🔍 Ищите!" : " ✅ Найдена"}
                        </strong>
                    </span>
                </div> */}
            </header>

            <GameProgress
                currentQuestion={currentQuestion}
                totalQuestions={questions.length}
                unlockedParts={unlockedParts}
                score={score}
                buttonFound={buttonFound}
                onReset={handleResetProgress}
            />

            <div className="game-container">
                <div className="snowman-section">
                    <Snowman unlockedParts={unlockedParts} />
                    <div className="hint-container">
                        {/* <div className="hint-box">
                            <div className="hint-icon">💡</div>
                            <div className="hint-content">
                                <p className="hint-title">Подсказка:</p>
                                <p className="hint-text">
                                    {showQuestionButton
                                        ? "Кнопка с вопросом где-то на странице. Ищите внимательно!"
                                        : "Кнопка найдена! Откройте вопрос и ответьте правильно."}
                                </p>
                            </div>
                        </div>
                        <div className="next-part-info">
                            <span className="part-icon">🎯</span>
                            <span className="part-text">
                                Следующая часть: <strong>{questions[currentQuestion].snowmanPart}</strong>
                            </span>
                        </div> */}
                    </div>
                </div>

                <div className="instructions-section">
                    <div className="instruction-card">
                        <h3>🎯 Цель игры</h3>
                        <p>Найдите 10 скрытых кнопок с вопросами и соберите все части снеговика.</p>
                        <div className="progress-indicator">
                            <div className="progress-dots">
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <span
                                        key={index}
                                        className={`dot ${index < currentQuestion ? 'completed' : ''} ${index === currentQuestion ? 'current' : ''}`}
                                        title={`Вопрос ${index + 1}`}
                                    >
                                        {index < currentQuestion ? '✓' : index + 1}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="instruction-card">
                        <h3>🎮 Как играть</h3>
                        <ul>
                            <li>
                                <span className="step-number">1</span>
                                Найдите на странице кнопку с вопросиком ❓
                            </li>
                            <li>
                                <span className="step-number">2</span>
                                Нажмите на неё для открытия вопроса
                            </li>
                            <li>
                                <span className="step-number">3</span>
                                Выберите правильный ответ
                            </li>
                            <li>
                                <span className="step-number">4</span>
                                Кнопка исчезнет и появится новая
                            </li>
                            <li>
                                <span className="step-number">5</span>
                                Заработайте все 10 частей снеговика!
                            </li>
                        </ul>
                    </div>

                    {/* <div className="instruction-card">
                        <h3>🏆 Ваш прогресс</h3>
                        <div className="progress-metrics">
                            <div className="metric">
                                <div className="metric-label">Найдено кнопок</div>
                                <div className="metric-value">
                                    {currentQuestion}/10
                                    <div className="metric-bar">
                                        <div
                                            className="metric-fill"
                                            style={{ width: `${(currentQuestion / 10) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="metric">
                                <div className="metric-label">Частей снеговика</div>
                                <div className="metric-value">
                                    {unlockedParts.length}/10
                                    <div className="metric-bar">
                                        <div
                                            className="metric-fill snowman-fill"
                                            style={{ width: `${(unlockedParts.length / 10) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="metric">
                                <div className="metric-label">Счет</div>
                                <div className="metric-value">
                                    {score}/10
                                    <div className="metric-bar">
                                        <div
                                            className="metric-fill score-fill"
                                            style={{ width: `${(score / 10) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            className="reset-progress-small"
                            onClick={handleResetProgress}
                        >
                            Сбросить прогресс
                        </button>
                    </div> */}
                </div>
            </div>

            {/* Случайно расположенная кнопка для вызова вопроса в модальном окне */}
            {showQuestionButton && (
                <button
                    className="random-question-button"
                    style={{
                        position: 'fixed',
                        left: `${buttonPosition.x}px`,
                        top: `${buttonPosition.y}px`,
                        animationDelay: `${animationDelay}s`
                    }}
                    onClick={handleRandomButtonClick}
                >
                    {/* <span className="question-icon">❓</span> */}
                    <span className="question-text">Вопрос {currentQuestion + 1}</span>
                    {/* <span className="question-hint-text">Нажмите меня!</span> */}
                </button>
            )}

            {/* Индикатор найденной кнопки */}
            {!showQuestionButton && buttonFound && (
                <div className="button-found-indicator">
                    <div className="found-message">
                        <span className="found-icon">✅</span>
                        <span>Кнопка найдена! Ответьте на вопрос в модальном окне.</span>
                    </div>
                </div>
            )}

            {/* Модальное окно с вопросом */}
            <Modal
                isOpen={showQuestionModal}
                onClose={() => {
                    const timer = setTimeout(() => {
                        setShowQuestionModal(false);
                        setShowQuestionButton(true);
                    }, 0);
                    return () => clearTimeout(timer);
                }}
                title={`Вопрос ${currentQuestion + 1}`}
            >
                <QuestionCard
                    question={questions[currentQuestion]}
                    onAnswer={handleAnswer}
                    onNext={handleNextQuestion}
                    onClose={() => {
                        const timer = setTimeout(() => setShowQuestionModal(false), 0);
                        return () => clearTimeout(timer);
                    }}
                />
            </Modal>

            {/* Модальное окно подтверждения сброса */}
            <ResetModal
                isOpen={showResetModal}
                onConfirm={confirmReset}
                onCancel={cancelReset}
                currentProgress={{
                    score,
                    unlockedParts: unlockedParts.length,
                    currentQuestion: currentQuestion + 1
                }}
            />

            {/* Панель управления кнопками */}
            {/* <div className="button-control-panel">
                <button
                    className="control-button find-button"
                    onClick={handleFindNewButton}
                    disabled={showQuestionButton}
                    title="Показать кнопку вопроса"
                >
                    <span className="control-icon">🔍</span>
                    <span className="control-text">
                        {showQuestionButton ? 'Кнопка видна' : 'Показать кнопку'}
                    </span>
                </button>

                <button
                    className="control-button move-button"
                    onClick={handleMoveButton}
                    disabled={!showQuestionButton}
                    title="Переместить кнопку вопроса"
                >
                    <span className="control-icon">🔄</span>
                    <span className="control-text">
                        Переместить кнопку
                    </span>
                </button>

                <button
                    className="control-button hint-button"
                    onClick={handleHintClick}
                    title="Подсказка где может быть кнопка"
                >
                    <span className="control-icon">💡</span>
                    <span className="control-text">Подсказка</span>
                </button>
            </div> */}

            {/* Эффект поиска кнопки */}
            {/* {showQuestionButton && (
                <div className="search-effect">
                    <div className="search-pulse"></div>
                    <div className="search-text">Ищите кнопку с вопросом!</div>
                </div>
            )} */}
        </div>
    );
}

export default App;