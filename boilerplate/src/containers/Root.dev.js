import React, { PropTypes } from 'react'
import { Provider } from 'react-redux'
import routes from '../routes'
import DevTools from './DevTools'
import { Router } from 'react-router'

if (!window.routes) {
  window.routes = routes;
}

const Root = ({ store, history }) => {
  return (
    <Provider store={store}>
      <div>
        <Router history={history} routes={window.routes} />
        <DevTools />
      </div>
    </Provider>
  )
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default Root
