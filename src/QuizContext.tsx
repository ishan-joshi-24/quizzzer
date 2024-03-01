import { createContext, useContext, useReducer } from 'react';

export interface Question {
    category: string;
    type: 'multiple' | 'boolean';
    difficulty: 'easy' | 'medium' | 'hard';
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

export interface QuestionsResponse {
    response_code: number;
    results: Question[];
}


interface QuizContext {
    state: QuizState,
    dispatch: React.Dispatch<QuizAction>
}

export type Status =
    "idle" | "fetching" | "ready" | "error" | 'answered'

interface Score {
    correct: number,
    incorrect: number,
}

interface QuizState {
    allQuestions: Question[]
    gameStatus: Status
    question: Question | null
    userAnswer: string | null
    score: Score
    questionNumber: number
}

type QuizAction =
    { type: 'setAllQuestions', payload: Question[] } |
    { type: 'setStatus', payload: Status } |
    { type: 'setQuestion', payload: Question } |
    { type: 'setUserAnswer', payload: string | null } |
    { type: 'setScore', payload: 'correct' | 'incorrect' }

const initialState: QuizState = {
    allQuestions: [],
    gameStatus: "idle",
    question: null,
    userAnswer: null,
    score: {
        correct: 0,
        incorrect: 0,
    },
    questionNumber: 0
}

const QuizContext = createContext<QuizContext>({ state: initialState, dispatch: () => null });

export function QuizProvider({ children }: { children: React.ReactElement }) {
    const [state, dispatch] = useReducer(QuizReducer, initialState)

    return <QuizContext.Provider value={{ state, dispatch }}>
        {children}
    </QuizContext.Provider>
}

export function useQuiz() {
    return useContext(QuizContext)
}

function QuizReducer(state: QuizState, action: QuizAction): QuizState {
    switch (action.type)
    {
        case 'setAllQuestions':
            return { ...state, allQuestions: action.payload, questionNumber: 0 }
        case 'setQuestion':
            return { ...state, question: action.payload, questionNumber: state.questionNumber + 1 }
        case 'setStatus':
            return { ...state, gameStatus: action.payload }
        case 'setUserAnswer':
            return { ...state, userAnswer: action.payload }
        case 'setScore':
            const score = state.score
            score[action.payload]++
            return { ...state, score }
        default:
            throw new Error('unknown action')
    }
} 