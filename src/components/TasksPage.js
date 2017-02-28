import React, { Component } from 'react';
import './TasksPage.css';

import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import CircularProgress from 'material-ui/CircularProgress';

import Task from './Task';

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

class TasksPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isEditingTaskList: false
    };
  }

  handleEditTaskList = () => {
    this.setState({
      isEditingTaskList: true
    }, () => this.taskList.focus());
  };

  handleTaskListEditKeyDown = (e) => {

    if (e.keyCode === ENTER_KEY) {
      this.saveTaskList();
    }

    if (e.keyCode === ESCAPE_KEY) {
      this.cancelEditingTaskList();
    }
  };

  saveTaskList = () => {

    this.props.onUpdateTaskList({
      name: this.taskList.value
    });

    this.cancelEditingTaskList();
  };

  cancelEditingTaskList = () => {
    this.setState({
      isEditingTaskList: false
    });
  };

  renderTasks = () => {
    return (
      <div className="TasksPage__tasks">
        {
          this.props.tasks.length ?
              this.props.tasks.map(task =>
                  <Task key={task.id}
                        text={task.text}
                        notes={task.notes}
                        due={task.due}
                        isCompleted={task.isCompleted}
                        onStatusChange={this.props.onTaskStatusChange.bind(null, task.id)}
                        onUpdate={this.props.onTaskUpdate.bind(null, task.id)}
                        onDelete={this.props.onTaskDelete.bind(null, task.id)}
                  />
              )
              :
              <div>Create your first task</div>
        }
      </div>
    );

  };

  render() {

    if (this.props.error) {
      return (
          <div className="TasksPage">
            <div className="TasksPage__error">
              {this.props.error}
            </div>
          </div>
      );
    }

    return (
        <div className="TasksPage">
          <div className="TasksPage__header">
            {
              this.state.isEditingTaskList
                  ?
                  <div>
                    <input
                      ref={c => this.taskList = c}
                      className='TasksPage__title-input'
                      defaultValue={this.props.taskList.name}
                      onKeyDown={this.handleTaskListEditKeyDown}
                      onBlur={this.cancelEditingTaskList}
                    />
                  </div>
                  :
                  <h2
                      className='TasksPage__title'
                      onClick={this.handleEditTaskList}
                  >
                    {this.props.taskList.name}
                  </h2>
            }
            <div className="TasksPage__tools">
              <IconButton onClick={this.props.onAddTask}>
                <ContentAdd />
              </IconButton>
              <IconButton onClick={this.props.onDeleteTaskList}>
                <ActionDelete />
              </IconButton>
            </div>
          </div>
          {
            this.props.isLoadingTasks
                ? <CircularProgress />
                : this.renderTasks()
          }
        </div>
    );
  }
}

export default TasksPage;
