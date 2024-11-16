import { useSelector as useReduxSelector, shallowEqual } from 'react-redux'
import { RootState } from 'store'

type Selector = (state: RootState) => any

const useSelector = (selector: Selector) => useReduxSelector(selector, shallowEqual)

export default useSelector
