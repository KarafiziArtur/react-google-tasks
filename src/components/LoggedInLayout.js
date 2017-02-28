import React, { Component } from 'react';
// import './AboutPage.css';

class LoggedInLayout extends Component {
  render() {
    return (
        <div className="LoggedInLayout">
          <div className="LoggedInLayout__content">
            {this.props.children}
          </div>
        </div>
    );
  }
}

export default LoggedInLayout;
