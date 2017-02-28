import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';

import api from '../api';

const SessionActions = {
  authorize(immediate = false, callback) {
    api.authorize({ immediate })
      .then(() => {
        AppDispatcher.dispatch({
          type: AppConstants.SESSION_AUTHORIZE_SUCCESS
        });

        if (callback) callback();
      })
      .catch((err) => {
        AppDispatcher.dispatch({
          type: AppConstants.SESSION_AUTHORIZE_FAIL,
          error: err
        });

        if (callback) callback();
      });
  },

  logout() {
    return new Promise((resolve, reject) => {
      api.logout()
          .then(() => {
            AppDispatcher.dispatch({
              type: AppConstants.SESSION_LOGOUT_SUCCESS
            });
            resolve();
          })
          .catch((error) => reject(error));
    });
  }
};

export default SessionActions;