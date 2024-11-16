import {RecoverPasswordForm} from 'modules/Auth/components'
import {useDispatch} from 'react-redux'
import {useCallback} from 'react'
import {recoverPassword} from "../slices/auth";

const RecoverPasswordContainer: React.FC = () => {

    const dispatch = useDispatch()

    const handleSubmit = useCallback((values) => {
        console.log("RecoverValue", values)
        dispatch(recoverPassword(values))
    }, [dispatch])

    return <RecoverPasswordForm onSubmit={handleSubmit}/>
}

export default RecoverPasswordContainer
