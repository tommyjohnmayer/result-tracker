import React, { Component } from "react";
import {
  DropdownButton,
  MenuItem,
  Modal,
  Panel,
  Table
} from "react-bootstrap";
import { PARTICIPANT, RESULT } from "../App";
import moment from "moment";
import AddResultForm from "./addResultForm";
import EditParticipantForm from "./editParticipantForm";

class Participants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editParticipantsModalVisible: false,
      participantsToEdit: []
    };
  }

  showEditParticipantsModal = (show, competitor) => {
    const { participants } = this.props;
    this.setState(prevState => {
      const participantsToEdit = Object.keys(participants)
        .map(key => participants[key])
        .filter(participant => participant.competitor === competitor);
      return {
        editParticipantsModalVisible: show,
        participantsToEdit
      };
    });
  };

  render() {
    const {
      selected,
      deleteEntity,
      addEntity,
      events,
      participants,
      competitors,
      results,
      editEntity
    } = this.props;
    const { editParticipantsModalVisible, participantsToEdit } = this.state;
    const participantsByCompetitor = Object.keys(participants)
      .filter(
        key => participants[key].event === selected.event || !selected.event
      )
      .map(key => participants[key])
      .reduce((acc, participant) => {
        if (!acc[participant.competitor]) {
          const competitor = competitors[participant.competitor];
          acc[participant.competitor] = {
            ...competitor,
            participants: []
          };
        }
        participant.event_name = events[participant.event].name;
        participant.results = Object.keys(results)
          .filter(key => results[key].participant === participant.id)
          .filter(key => results[key].event === participant.event)
          .map(key => results[key]);
        acc[participant.competitor].participants.push(participant);
        return acc;
      }, {});

    return (
      <Panel defaultExpanded>
        <Panel.Heading>
          <Panel.Title>Participants</Panel.Title>
        </Panel.Heading>
        <Table condensed>
          {Object.keys(participantsByCompetitor).map(key => {
            return (
              <React.Fragment key={key}>
                {participantsByCompetitor[key].participants.map(
                  (participant, index) => {
                    return (
                      <tbody key={participant.id}>
                        <tr>
                          {index === 0 && (
                            <React.Fragment>
                              <td nowrap="true">
                                <DropdownButton
                                  bsStyle="link"
                                  id="meet-menu"
                                  title={participantsByCompetitor[key].name}
                                >
                                  <MenuItem
                                    key="edit-participants"
                                    onSelect={() =>
                                      this.showEditParticipantsModal(true, key)
                                    }
                                  >
                                    Edit
                                  </MenuItem>
                                  {Object.keys(events)
                                    .map(key => events[key])
                                    .filter(
                                      event =>
                                        !Object.keys(participants)
                                          .map(key => participants[key])
                                          .filter(
                                            participant =>
                                              participant.competitor === key
                                          )
                                          .map(participant => participant.event)
                                          .includes(event.id)
                                    )
                                    .map(event => (
                                      <MenuItem
                                        key={event.id}
                                        eventKey={event.id}
                                        onSelect={() =>
                                          addEntity(PARTICIPANT, {
                                            competitor: key,
                                            event: event.id,
                                            meet: selected.meet,
                                            division:
                                              participantsByCompetitor[key]
                                                .division
                                          })
                                        }
                                      >
                                        Enter {event.name}
                                      </MenuItem>
                                    ))}
                                  <MenuItem divider />
                                  {Object.keys(participants)
                                    .map(key => participants[key])
                                    .filter(
                                      participant =>
                                        participant.competitor === key
                                    )
                                    .map(participant => (
                                      <MenuItem
                                        key={participant.id}
                                        eventKey={participant.id}
                                        onSelect={() =>
                                          deleteEntity(
                                            PARTICIPANT,
                                            participant.id
                                          )
                                        }
                                      >
                                        withdraw from {participant.event_name}
                                      </MenuItem>
                                    ))}
                                </DropdownButton>
                              </td>
                            </React.Fragment>
                          )}
                          {index === 0 && <td>{participant.division}</td>}
                          {index > 0 && (
                            <React.Fragment>
                              <td />
                              <td />
                            </React.Fragment>
                          )}
                          {!selected.event && <td>{participant.event_name}</td>}
                          <td>
                            <AddResultForm
                              addEntity={addEntity}
                              participant={participant}
                            />
                          </td>
                          {participant.results.map(result => (
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
                                  onSelect={() =>
                                    deleteEntity(RESULT, result.id)
                                  }
                                  eventKey="1"
                                >
                                  delete
                                </MenuItem>
                              </DropdownButton>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    );
                  }
                )}
              </React.Fragment>
            );
          })}
        </Table>
        <Modal
          show={editParticipantsModalVisible}
          onHide={() => this.showEditParticipantsModal(false, undefined)}
        >
          <Panel>
            <Panel.Heading>Edit Participants</Panel.Heading>
            <Panel.Body>
              <Table>
                <tbody>
                  {participantsToEdit.map(participant => (
                    <EditParticipantForm
                      participant={participant}
                      events={events}
                      editEntity={editEntity}
                      results={results}
                    />
                  ))}
                </tbody>
              </Table>
            </Panel.Body>
          </Panel>
        </Modal>
      </Panel>
    );
  }
}

export default Participants;
