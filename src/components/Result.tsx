import { useQuiz } from '../QuizContext.tsx'
import { decode } from 'html-entities'

function Result() {
    const { state } = useQuiz()


    return (
        <>
            {
                state.userAnswer === state.question?.correct_answer ?
                    <div className="result correct">&#10003; You answered correctly!</div> :
                    <div className="result incorrect">&#x274C; You answer is wrong! The correct answer is {decode(state.question?.correct_answer)}</div>
            }
        </>
    )
}

export default Result
