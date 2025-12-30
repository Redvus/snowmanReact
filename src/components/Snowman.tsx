import React from 'react';

interface SnowmanProps {
    unlockedParts: number[];
}

const Snowman: React.FC<SnowmanProps> = ({ unlockedParts }) => {
    // const parts = [
    //     { id: 0, name: 'Подставка', className: 'snowman-base' },
    //     { id: 1, name: 'Большой шар', className: 'snowman-middle' },
    //     { id: 2, name: 'Средний шар', className: 'snowman-body' },
    //     { id: 3, name: 'Голова', className: 'snowman-head' },
    //     { id: 4, name: 'Ведро', className: 'snowman-hat' },
    //     { id: 5, name: 'Глаза', className: 'snowman-eyes' },
    //     { id: 6, name: 'Нос-морковка', className: 'snowman-nose' },
    //     { id: 7, name: 'Рот', className: 'snowman-mouth' },
    //     { id: 8, name: 'Руки-ветки', className: 'snowman-arms' },
    //     { id: 9, name: 'Шарфик', className: 'snowman-scarf' },
    // ];

    const parts = [
        { id: 0, name: 'BottomCircle', image: 'snowman_1Circle.webp', order: 1 },
        { id: 1, name: 'MiddleCircle', image: 'snowman_2Circle.webp', order: 2 },
        { id: 2, name: 'TopCircle', image: 'snowman_3Circle.webp', order: 3 },
        { id: 3, name: 'Bucket', image: 'snowman_bucket.webp', order: 4 },
        { id: 4, name: 'Scarf', image: 'snowman_scurf.webp', order: 5 },
        { id: 5, name: 'Hands', image: 'snowman_hands.webp', order: 6 },
        { id: 6, name: 'Mittens', image: 'snowman_mittens.webp', order: 7 },
        { id: 7, name: 'Broomstick', image: 'snowman_broomstick.webp', order: 8 },
        { id: 8, name: 'Face', image: 'snowman_face.webp', order: 9 },
        { id: 9, name: 'Nose', image: 'snowman_nose.webp', order: 10 }
    ];

    return (
        <div className="snowman-container">
            <div className="snowman" id="snowman">
                {parts.map(part => (
                    <picture
                        key={part.id}
                        className={`snowman__part ${unlockedParts.includes(part.id) ? 'unlocked' : 'locked'
                            }`}
                        title={`${part.name} - ${unlockedParts.includes(part.id) ? 'Разблокировано' : 'Заблокировано'}`}
                    >
                        {/* {unlockedParts.includes(part.id) && (
                            <span className="part-indicator">✓</span>
                        )} */}
                        <img src={`/src/assets/games/snowman/images/${part.image}`} alt={part.name}></img>
                    </picture>
                ))}
            </div>
        </div>
    );
};

export default Snowman;