import React, { Component } from "react";
import { Button, Form, FormControl } from "react-bootstrap";
import { RESULT, PARTICIPANT } from "../App";

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
    const { results, editEntity } = this.props;
    const { updatedParticipant } = this.state;
    editEntity(PARTICIPANT, updatedParticipant);
    Object.keys(results)
      .map(key => results[key])
      .filter(result => result.participant === updatedParticipant.id)
      .forEach(result => {
        result.division = updatedParticipant.division;
        editEntity(RESULT, result);
      });
  };

  render() {
    const { participant, events } = this.props;
    const { updatedParticipant } = this.state;
    return (
      <tr>
        <td>{events[participant.event].name}</td>
        <td>
          <Form onSubmit={this.editParticipant} inline>
            <FormControl
              type="text"
              value={updatedParticipant.division}
              name="division"
              data-object="updatedParticipant"
              placeholder="00:00.00"
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
