export interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
    snowmanPart: string;
}

export interface SnowmanPart {
    id: number;
    name: string;
    image: string;
    unlocked: boolean;
}

export type GameState = {
    currentQuestion: number;
    unlockedParts: number[];
    score: number;
    completed: boolean;
};