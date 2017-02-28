import { CLIENT_ID } from '../config';
const SCOPES = ['https://www.googleapis.com/auth/tasks', 'https://www.googleapis.com/auth/plus.me'];

export default {
  authorize(params) {
    return new Promise((resolve, reject) => {

      //eslint-disable-next-line
      gapi.auth.authorize(
          {
            'client_id': CLIENT_ID,
            'scope': SCOPES,
            'immediate': params.immediate,
            'cookie_policy': 'single_host_origin'
          },
          authResult => {
            if (authResult.error) {
              return reject(authResult.error);
            }
            // eslint-disable-next-line
            return gapi.client.load('tasks', 'v1', () => gapi.client.load('plus', 'v1', () => resolve()));
          }
      );

    });
  },

  logout() {
    return new Promise((resolve, reject) => {
      //eslint-disable-next-line
      const token = gapi.auth.getToken();

      if (token) {
        //eslint-disable-next-line
        const accessToken = gapi.auth.getToken().access_token;

        fetch(`https://accounts.google.com/o/oauth2/revoke?token=${accessToken}`, {
          mode: 'no-cors'
        })
            .then((res) => {
              //eslint-disable-next-line
              gapi.auth.signOut();
              resolve();
            })
            .catch((error) => reject(error));
      }

    });
  },

  listTaskLists() {
    // eslint-disable-next-line
    const request = gapi.client.tasks.tasklists.list();

    return this.makeRequest(request);
  },

  showTaskList(taskListId) {
    // eslint-disable-next-line
    const request = gapi.client.tasks.tasklists.get({
      tasklist: taskListId
    });

    return this.makeRequest(request);
  },

  insertTaskList({title}) {
    // eslint-disable-next-line
    const request = gapi.client.tasks.tasklists.insert({
      title
    });

    return this.makeRequest(request);
  },

  updateTaskList({taskListId, title}) {
    // eslint-disable-next-line
    const request = gapi.client.tasks.tasklists.update({
      tasklist: taskListId,
      id: taskListId,
      title
    });

    return this.makeRequest(request);
  },

  deleteTaskList({taskListId}) {
    // eslint-disable-next-line
    const request = gapi.client.tasks.tasklists.delete({
      tasklist: taskListId
    });

    return this.makeRequest(request);
  },

  listTasks(taskListId) {
    // eslint-disable-next-line
    const request = gapi.client.tasks.tasks.list({
      tasklist: taskListId
    });

    return this.makeRequest(request);
  },

  insertTask({taskListId, ...params}) {
    // eslint-disable-next-line
    const request = gapi.client.tasks.tasks.insert({
      tasklist: taskListId,
      ...params
    });

    return this.makeRequest(request);
  },

  updateTask({taskListId, taskId, ...params}) {
    // eslint-disable-next-line
    const request = gapi.client.tasks.tasks.update({
      tasklist: taskListId,
      task: taskId,
      id: taskId,
      ...params
    });

    return this.makeRequest(request);
  },

  deleteTask({taskListId, taskId}) {
    // eslint-disable-next-line
    const request = gapi.client.tasks.tasks.delete({
      tasklist: taskListId,
      task: taskId,
      id: taskId
    });

    return this.makeRequest(request);
  },

  makeRequest(requestObj) {
    return new Promise((resolve, reject) => {
      requestObj.execute(resp =>
          resp.error
              ? reject(resp.error)
              : resolve(resp.result)
      );
    });
  }
}
