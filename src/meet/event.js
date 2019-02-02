import React, { Component } from "react";
import {
  Button,
  DropdownButton,
  FormControl,
  Glyphicon,
  MenuItem,
  Modal,
  Panel,
  Table
} from "react-bootstrap";
import { EVENT, PARTICIPANT, RESULT } from "../App";
import moment from "moment";
import RunOrderModal from "./runOrderModal";
import AddResultForm from './addResultForm';

class Participants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editEventModalVisible: false,
      editRunOrderModalVisible: false,
      updateEvent: {}
    };
  }

  editParticipant = participant => {
    const { editEntity } = this.props;
    editEntity(PARTICIPANT, participant);
  };

  updateEvent = event => {
    event.preventDefault();
    const { editEntity } = this.props;
    const { updateEvent } = this.state;
    editEntity(EVENT, updateEvent);
    this.showEditEventModal(false);
  };

  handleChange = event => {
    this.setState({
      [event.target.dataset.object]: {
        ...this.state[event.target.dataset.object],
        [event.target.name]: event.target.value
      }
    });
  };

  showEditEventModal = show => {
    this.setState({
      editEventModalVisible: show,
      editRunOrderModalVisible: false,
      updateEvent: this.props.event
    });
  };

  showRunOrderModal = show => {
    this.setState({
      editEventModalVisible: false,
      editRunOrderModalVisible: show
    });
  };

  render() {
    const {
      participants,
      selected,
      competitors,
      results,
      addEntity,
      deleteEntity,
      event
    } = this.props;
    const {
      editEventModalVisible,
      editRunOrderModalVisible,
      updateEvent
    } = this.state;
    const participantArray = Object.keys(participants)
      .map(key => participants[key])
      .filter(
        participant => participant.event === selected.event || !selected.event
      )
      .sort((a, b) => a.order - b.order);
    const participantForSelectedEventByOrder = Object.keys(participants)
      .filter(key => participants[key].event === selected.event)
      .map(key => participants[key])
      .sort((a, b) => a.order - b.order);
    return (
      <Panel defaultExpanded>
        <Panel.Heading>
          <Panel.Title>
            {event.name}
            <DropdownButton
              bsStyle="link"
              id="meet-menu"
              noCaret
              title={<Glyphicon glyph="menu-hamburger" />}
            >
              <MenuItem
                eventKey="order"
                onSelect={() => this.showRunOrderModal(true)}
              >
                set run order
              </MenuItem>
              <MenuItem divider />
              <MenuItem
                eventKey="edit"
                onSelect={() => this.showEditEventModal(true)}
              >
                edit {event.name}
              </MenuItem>
              <MenuItem divider />
              <MenuItem
                onSelect={() => deleteEntity(EVENT, event.id)}
                eventKey="delete"
              >
                delete {event.name}
              </MenuItem>
            </DropdownButton>
          </Panel.Title>
        </Panel.Heading>
        <Table condensed>
          <tbody>
            {participantArray.map(participant => (
              <tr key={participant.id}>
                <td>
                  <DropdownButton
                    bsStyle="link"
                    id="meet-menu"
                    title={competitors[participant.competitor].name}
                  >
                    <MenuItem
                      eventKey="withdraw"
                      onSelect={() => deleteEntity(PARTICIPANT, participant.id)}
                    >
                      Withdraw from {event.name}
                    </MenuItem>
                  </DropdownButton>
                </td>
                <td>{participant.division}</td>
                <td>
                  <AddResultForm
                    addEntity={addEntity}
                    participant={participant}
                  />
                </td>
                {Object.keys(results)
                  .map(key => results[key])
                  .filter(result => result.participant === participant.id)
                  .map(result => (
                    <td key={result.id}>
                      <DropdownButton
                        bsStyle="link"
                        id="meet-menu"
                        title={
                          result.time.asMinutes() > 1
                            ? moment
                                .utc(result.time.as("milliseconds"))
                                .format("m:ss.SS")
                            : result.time.asSeconds()
                        }
                      >
                        <MenuItem
                          onSelect={() => deleteEntity(RESULT, result.id)}
                          eventKey="delete"
                        >
                          delete
                        </MenuItem>
                      </DropdownButton>
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </Table>
        <RunOrderModal
          show={editRunOrderModalVisible}
          hide={this.showRunOrderModal}
          participants={participantForSelectedEventByOrder}
          competitors={competitors}
          editParticipant={this.editParticipant}
        />
        <Modal
          show={editEventModalVisible}
          onHide={() => this.showEditEventModal(false)}
        >
          <Panel>
            <Panel.Heading>{event.name}</Panel.Heading>

            <Panel.Body>
              <form onSubmit={this.updateEvent}>
                <FormControl
                  type="text"
                  value={updateEvent.name}
                  name="name"
                  placeholder="Enter Event Name"
                  onChange={this.handleChange}
                  data-object="updateEvent"
                  autoComplete="off"
                />
                <Button bsStyle="primary" type="submit">
                  update event
                </Button>
              </form>
            </Panel.Body>
          </Panel>
        </Modal>
      </Panel>
    );
  }
}

export default Participants;
