import React, { Component } from 'react';

import SessionStore from '../stores/SessionStore';
import SessionActions from '../actions/SessionActions';

import LoginPage from '../components/LoginPage';

function getStateFromFlux() {
  return {
    isLoggedIn: SessionStore.isLoggedIn()
  };
}

class LoginPageContainer extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = getStateFromFlux();
  }

  componentDidMount() {
    SessionStore.addChangeListener(this._onChange);

    if (this.state.isLoggedIn) {
      this.redirectLoggenInUser();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.isLoggedIn) {
      this.redirectLoggenInUser();
    }
  }

  componentWillUnmount() {
    SessionStore.removeChangeListener(this._onChange);
  }

  redirectLoggenInUser = () => {
    const {location} = this.props;

    if (location.state && location.state.nextPathname) {
      this.context.router.replace(location.state.nextPathname);
    } else {
      this.context.router.replace('/lists');
    }
  };

  handleLogin = () => {
    SessionActions.authorize();
  };

  render() {
    return (
        <LoginPage onLogin={this.handleLogin} />
    );
  }

  _onChange = () => {
    this.setState(getStateFromFlux());
  }
}

LoginPageContainer.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default LoginPageContainer;
