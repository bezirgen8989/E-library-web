import 'assets/css/global.css'
import 'normalize.css'
import { Provider } from 'react-redux'
import store from 'store'
import Router from 'routing'


const Root = () => {
  return (
      <Provider store={store}>
        <Router />
      </Provider>

  )
}

export default Root
