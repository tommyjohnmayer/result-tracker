import React, { Component } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import { PARTICIPANT } from '../App';

class EditParticipantForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updatedParticipant: { ...this.props.participant }
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.dataset.object]: {
        ...this.state[event.target.dataset.object],
        [event.target.name]: event.target.value
      }
    });
  };

  editParticipant = event => {
    event.preventDefault();
    const { editEntity } = this.props;
    const { updatedParticipant } = this.state;
    editEntity(PARTICIPANT, updatedParticipant);
  };

  render() {
    const { participant, events } = this.props;
    const { updatedParticipant } = this.state;
    return (
      <tr>
        <td>
          {events.filter(event => event.id === participant.event)[0].name}
        </td>
        <td>
          <Form onSubmit={this.editParticipant} inline>
            <FormControl
              type="text"
              value={updatedParticipant.division}
              name="division"
              data-object="updatedParticipant"
              placeholder="enter division"
              onChange={this.handleChange}
              autoComplete="off"
            />
            <Button bsStyle="primary" type="submit">
              update
            </Button>
          </Form>
        </td>
      </tr>
    );
  }
}

export default EditParticipantForm;
