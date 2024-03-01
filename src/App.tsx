import { useEffect } from 'react';
import './App.scss'
import Score from './components/Score.tsx';
import Game from './components/Game.tsx';
import FullPageLoader from './components/FullPageLoader.tsx'
import { useQuiz, QuestionsResponse, Question } from './QuizContext.tsx';

function App() {
  const { state, dispatch } = useQuiz()
  const maxQuestions = 50;

  async function getAllQuestions(): Promise<Question[]> {
    if (state.allQuestions.length !== 0 && state.questionNumber < maxQuestions) return state.allQuestions;

    const url = `https://opentdb.com/api.php?amount=${maxQuestions}`
    const response = await fetch(url)

    const data: QuestionsResponse = await response.json()
    if (data.response_code !== 0) return [];

    const questions = data.results.map((question) => {
      const randomIndex = Math.round(Math.random() * question.incorrect_answers.length)
      question.incorrect_answers.splice(randomIndex, 0, question.correct_answer)
      return question;
    })


    dispatch({ type: 'setAllQuestions', payload: questions })

    return questions;
  }

  async function fetchQuestion() {
    try
    {
      dispatch({ type: 'setStatus', payload: 'fetching' })
      dispatch({ type: 'setUserAnswer', payload: null })

      const questions = await getAllQuestions();
      console.log(`all questions legnth is ${state.allQuestions.length}`)
      console.log(`question number is ${state.questionNumber}`)


      if (questions.length)
      {
        const question = questions[state.questionNumber];
        dispatch({ type: 'setStatus', payload: 'ready' })
        dispatch({ type: 'setQuestion', payload: question })
        if (state.questionNumber === questions.length - 1)
        {
          dispatch({ type: 'setAllQuestions', payload: [] })
        }
      }
      else
        dispatch({ type: 'setStatus', payload: 'error' })
    } catch (e: unknown)
    {
      console.log(`error: ${e}`)
      dispatch({ type: 'setStatus', payload: 'error' })
    }

  }

  useEffect(() => {
    if (state.gameStatus === 'idle')
    {
      fetchQuestion()
    }
  })

  return (
    <>
      {state.gameStatus === 'fetching' ?
        <FullPageLoader /> : state.gameStatus === 'error' ?
          <p>Error...</p> :
          <>
            <Score />
            <Game />
          </>
      }
    </>
  )
}

export default App
