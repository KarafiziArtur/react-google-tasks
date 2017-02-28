import React, { Component } from 'react';

import TasksActions from '../actions/TasksActions';
import TaskListsActions from '../actions/TaskListsActions';
import TasksStore from '../stores/TasksStore';
import TaskListsStore from '../stores/TaskListsStore';

import TasksPage from '../components/TasksPage';
import TaskCreateModal from '../components/TaskCreateModal';

function getStateFromFlux() {
  return {
    tasks: TasksStore.getTasks(),
    error: TasksStore.getError(),
    isLoadingTask: TasksStore.isLoadingTasks(),
    taskList: TaskListsStore.getCurrentTaskList() || {}
  };
}

class TasksPageContainer extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      ...getStateFromFlux(),
      isCreatingTask: false
    };
  }

  componentWillMount() {
    TasksActions.loadTasks(this.props.params.id);
    TaskListsActions.loadTaskList(this.props.params.id);
  }

  componentDidMount() {
    TasksStore.addChangeListener(this._onChange);
    TaskListsStore.addChangeListener(this._onChange);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.id !== nextProps.params.id) {
      TasksActions.loadTasks(nextProps.params.id);
      TaskListsActions.loadTaskList(nextProps.params.id);
    }
  }

  componentWillUnmount() {
    TasksStore.removeChangeListener(this._onChange);
    TaskListsStore.removeChangeListener(this._onChange);
  }

  handleTaskStatusChange = (taskId, { isCompleted }) => {
    TasksActions.updateTaskStatus({
      taskListId: this.props.params.id,
      taskId,
      isCompleted
    });
  };

  handleTaskUpdate = (taskId, task) => {
    TasksActions.updateTask({
      taskListId: this.props.params.id,
      taskId: taskId,
      ...task
    });
  };

  handleTaskDelete = (taskId) => {
    TasksActions.deleteTask({
      taskListId: this.props.params.id,
      taskId
    });
  };

  handleAddTask = () => {
    this.setState({ isCreatingTask: true });
  };

  handleTaskCreateModalClose = () => {
    this.setState({ isCreatingTask: false });
  };

  handleTaskSubmit = (task) => {
    const taskListId = this.props.params.id;

    TasksActions.createTask({ taskListId, ...task });

    this.setState({ isCreatingTask: false });
  };

  handleDeleteTaskList = () => {
    const isConfirmed = confirm(
        'All tasks in this Task List will be deleted too. Are you sure to delete this Task List?'
    );

    if (isConfirmed) {
      TaskListsActions.deleteTaskList({
        taskListId: this.props.params.id
      });
      this.context.router.push('/lists');
    }

  };

  handleUpdateTaskList = ({name}) => {
    TaskListsActions.updateTaskList({
      taskListId: this.props.params.id,
      name
    });
  };

  render() {
    return (
        <div className="TasksPage">
          <TasksPage taskList={this.state.taskList}
                     tasks={this.state.tasks}
                     error={this.state.error}
                     isLoadingTasks={this.state.isLoadingTask}
                     onUpdateTaskList={this.handleUpdateTaskList}
                     onAddTask={this.handleAddTask}
                     onDeleteTaskList={this.handleDeleteTaskList}
                     onTaskDelete={this.handleTaskDelete}
                     onTaskStatusChange={this.handleTaskStatusChange}
                     onTaskUpdate={this.handleTaskUpdate}
          />
          <TaskCreateModal isOpen={this.state.isCreatingTask}
                           onSubmit={this.handleTaskSubmit}
                           onClose={this.handleTaskCreateModalClose}
          />
        </div>
    );
  }

  _onChange = () => {
    this.setState(getStateFromFlux());
  };
}

TasksPageContainer.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default TasksPageContainer;
