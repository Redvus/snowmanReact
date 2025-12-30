import React from 'react';

interface ResetModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    currentProgress: {
        score: number;
        unlockedParts: number;
        currentQuestion: number;
    };
}

const ResetModal: React.FC<ResetModalProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    currentProgress
}) => {
    if (!isOpen) return null;

    const handleOverlayClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            onCancel();
        }
    };

    return (
        <div className="reset-modal-overlay" onClick={handleOverlayClick}>
            <div className="reset-modal-content">
                <div className="reset-modal-header">
                    <h2>⚠️ Сброс прогресса</h2>
                </div>

                <div className="reset-modal-body">
                    <div className="warning-icon">
                        <span>🚨</span>
                    </div>

                    <p className="warning-text">
                        Вы уверены, что хотите сбросить весь прогресс игры?
                    </p>

                    <div className="current-stats">
                        <h3>Текущий прогресс:</h3>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <span className="stat-label">Вопрос:</span>
                                <span className="stat-value">{currentProgress.currentQuestion}/10</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Счет:</span>
                                <span className="stat-value">{currentProgress.score}/10</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Части снеговика:</span>
                                <span className="stat-value">{currentProgress.unlockedParts}/10</span>
                            </div>
                        </div>
                    </div>

                    <ul className="reset-info">
                        <li>Все собранные части снеговика будут потеряны</li>
                        <li>Счет обнулится</li>
                        <li>Игра начнется с первого вопроса</li>
                        <li>Кнопка вопроса появится в новом месте</li>
                    </ul>
                </div>

                <div className="reset-modal-footer">
                    <button
                        className="reset-btn cancel-btn"
                        onClick={onCancel}
                    >
                        Отмена
                    </button>
                    <button
                        className="reset-btn confirm-btn"
                        onClick={onConfirm}
                    >
                        Сбросить прогресс
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetModal;