import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

class TaskCreateModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      notes: '',
      due: null
    };
  }

  handleClose = () => {
    const { onClose } = this.props;

    if (onClose) {
      onClose();
    }

    this.resetState();
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;

    if (onSubmit) {
      onSubmit({ text: this.state.text, notes: this.state.notes, due: this.state.due });
    }

    this.resetState();
  };

  handleTextChangeText = (e) => {
    this.setState({ text: e.target.value });
  };

  handleTextChangeDesc = (e) => {
    this.setState({ notes: e.target.value });
  };

  handleTextChangeDue = (e, date) => {
    this.setState({ due: date });
  };

  disalbleDateBeforeNow(date) {
    const now = new Date();
    now.setUTCDate(now.getUTCDate() - 1);
    return date < now ;
  }

  resetState() {
    this.setState({ text: '', notes: '', due: null });
  }

  render() {
    const { text, notes } = this.state;
    const { isOpen } = this.props;

    return (
        <Dialog className="TaskCreateModal"
                contentStyle={{maxWidth: 400}}
                actions={[
                  <FlatButton label="Cancel"
                              onTouchTap={this.handleClose}
                  />,
                  <FlatButton primary
                              label="Submit"
                              disabled={!text}
                              onTouchTap={this.handleSubmit}
                  />
                ]}
                open={isOpen}
                onRequestClose={this.handleClose}
        >
          <h3 className="TaskCreateModal__modal-title">Add task</h3>
          <TextField fullWidth
                     autoFocus
                     value={text}
                     onChange={this.handleTextChangeText}
                     hintText="e.g. learn React"
                     floatingLabelText="Enter task name"
          />
          <TextField fullWidth
                     value={notes}
                     onChange={this.handleTextChangeDesc}
                     hintText="e.g. from reactjsprogram"
                     floatingLabelText="Enter task description"
                     multiLine={true}
                     rows={2}
                     rowsMax={4}
          />
          <DatePicker fullWidth
                      hintText="Portrait Dialog"
                      onChange={this.handleTextChangeDue}
                      floatingLabelText="Enter due date"
                      shouldDisableDate={this.disalbleDateBeforeNow}

          />
        </Dialog>
    );
  }

}

export default TaskCreateModal;