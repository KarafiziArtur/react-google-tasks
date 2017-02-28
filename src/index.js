import React          from 'react';
import ReactDOM       from 'react-dom';
import { Router, Route, browserHistory, Redirect, IndexRoute } from 'react-router';
import './index.css';

import SessionActions from './actions/SessionActions';
import SessionStore   from './stores/SessionStore';

import App            from './App';
import LoggedInLayout from './components/LoggedInLayout';
import AboutPage      from './components/AboutPage';

import LoginPage      from './containers/LoginPageContainer';
import TaskListsPage  from './containers/TaskListsPageContainer';
import TasksPage      from './containers/TasksPageContainer';

window.handleGoogleApiLoaded = () => {
  SessionActions.authorize(true, renderApp);
};

function renderApp()  {
  ReactDOM.render(
    <Router history={browserHistory}>
      <Redirect from='/' to='/login' />
      <Route path='/' component={App}>
        <Route path='/login' component={LoginPage} />
        <Route component={LoggedInLayout} onEnter={requireAuth}>
          <Route path='/lists' component={TaskListsPage}>
            <IndexRoute component={AboutPage} />
            <Route path='/lists/:id' component={TasksPage} />
          </Route>
        </Route>
      </Route>
    </Router>,
    document.getElementById('root')
  );
}

function requireAuth(nextState, replace) {
  if (!SessionStore.isLoggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}