import React, { Component } from 'react';

import SessionActions from '../actions/SessionActions';
import SessionStore from '../stores/SessionStore';

import TaskListsStore from '../stores/TaskListsStore';
import TaskListsActions from '../actions/TaskListsActions';

import TaskListCreateModal from '../components/TaskListCreateModal';
import TaskListsPage from '../components/TaskListsPage';

function getStateFromFlux() {
  return {
    taskLists: TaskListsStore.getTaskLists()
  };
}

class TaskListsPageContainer extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      ...getStateFromFlux(),
      isCreatingTaskList: false
    };
  }

  componentWillMount() {
    TaskListsActions.loadTaskLists();
  }

  componentDidMount() {
    TaskListsStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    TaskListsStore.removeChangeListener(this._onChange);
  }

  handleAddTaskList = () => {
    this.setState({ isCreatingTaskList: true });
  };

  handleTaskListCreateModalClose = () => {
    this.setState({ isCreatingTaskList: false });
  };

  handleTaskListSubmit = (taskList) => {
    TaskListsActions.createTaskList(taskList);

    this.setState({ isCreatingTaskList: false });
  };

  onLogOut = () => {
    SessionActions.logout()
        .then(() => {
          if (!SessionStore.isLoggedIn()) {
            this.context.router.replace('/login');
          }
        });
  };

  render() {
    return (
        <div>
          <TaskListsPage taskLists={this.state.taskLists}
                         page={this.props.children}
                         onAddTaskList={this.handleAddTaskList}
                         onLogOut={this.onLogOut}
          />
          <TaskListCreateModal isOpen={this.state.isCreatingTaskList}
                               onSubmit={this.handleTaskListSubmit}
                               onClose={this.handleTaskListCreateModalClose}
          />
        </div>
    );
  }

  _onChange = () => {
    this.setState(getStateFromFlux());
  };
}

TaskListsPageContainer.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default TaskListsPageContainer;
