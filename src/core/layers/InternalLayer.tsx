import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { SessionUtils } from 'utils'
import { clearSessionInfo } from 'core/session/slices/session'
import { getMe } from '../../modules/Auth/slices/auth'
import { useLazySelector } from '../../hooks'
import {UserContext} from 'core/contexts'

// Internal layer
// Setup private Application part
const InternalLayer: React.FC = ({ children }) => {

  const { result,  } = useLazySelector(({ auth }) => {
    const { userData } = auth
    const {result,} = userData
    return {
      result,
    }
  })
  const dispatch = useDispatch()

  useEffect(()=> {
    dispatch(getMe())
  }, [])

  // Check session on page refresh
  useEffect(() => {
    const sessionToken = SessionUtils.getSessionToken()
    if (sessionToken) {
      // Check token alive
    } else {
      dispatch(clearSessionInfo())
    }
  }, [])

  // Return null without token

  return <UserContext.Provider value={result}>{children}</UserContext.Provider>
}

export default InternalLayer
