import React, { Component } from 'react';
import './Task.css';

import moment from 'moment';

import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { List, ListItem } from 'material-ui/List';
import DatePicker from 'material-ui/DatePicker';

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

class Task extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false
    };
  }

  handleEdit = () => {
    this.setState({ isEditing: true }, this.focusInput);
  };

  handleCancel = () => {
    this.cancelTask();
  };

  handleSave = () => {
    this.saveTask();
  };

  handleCheck = () => {
    this.props.onStatusChange({
      isCompleted: !this.props.isCompleted
    });
  };

  handleDelete = () => {
    this.props.onDelete();
  };

  handleKeyDown = (e) => {
    if(e.keyCode === ENTER_KEY) {
      this.saveTask();
    }
    if (e.keyCode === ESCAPE_KEY) {
      this.cancelTask();
    }
  };

  focusInput = () => {
    this.input.focus();
  };

  saveTask = () => {
    this.props.onUpdate({
      text: this.input.value,
      notes: this.textarea.value,
      due: this.due.state.date
    });

    this.setState({ isEditing: false });
  };

  cancelTask = () => {
    this.setState({ isEditing: false });
  };

  disalbleDateBeforeNow(date) {
    const now = new Date();
    now.setUTCDate(now.getUTCDate() - 1);
    return date < now ;
  }

  renderDue() {
    if (this.props.due) {
      return moment(this.props.due).format('LL');
    } else {
      return '';
    }
  }

  render() {
    const { text, notes, due, isCompleted } = this.props;

    return (
        this.state.isEditing
            ?
              <div className="Task editing">
                <input className="Task__input"
                       type="text"
                       defaultValue={text}
                       onKeyDown={this.handleKeyDown}
                       ref={c => this.input = c}
                />
                <textarea className="Task__textarea"
                          cols="30"
                          rows="3"
                          defaultValue={notes}
                          ref={c => this.textarea = c}
                          placeholder="Enter task description"
                />
                <DatePicker className="Task__datepicker"
                            fullWidth
                            hintText="Portrait Dialog"
                            floatingLabelText="Enter due date"
                            shouldDisableDate={this.disalbleDateBeforeNow}
                            ref={c => this.due = c}
                            defaultDate={due}
                />
                <div className="Task__toolbar">
                  <div>
                    <RaisedButton primary onClick={this.handleSave} label="Save" />
                    <FlatButton onClick={this.handleCancel} label="Cancel" />
                  </div>
                </div>
              </div>
            :
              <div className="Task">
                <Checkbox className="Task__checkbox"
                          checked={isCompleted}
                          onCheck={this.handleCheck}
                />

                <div className="Task__text" onClick={this.handleEdit}>
                  <List>
                    <ListItem
                        rightIcon={<span style={{width: "auto"}}>{this.renderDue()}</span>}
                        primaryText={text}
                        secondaryText={notes}
                        disabled
                    />
                  </List>
                </div>

                <IconMenu iconButtonElement={<IconButton><MoreVertIcon/></IconButton>}>
                  <MenuItem onClick={this.handleEdit}>Edit</MenuItem>
                  <MenuItem onClick={this.handleDelete}>Delete</MenuItem>
                </IconMenu>
              </div>
    );
  }
}

export default Task;
