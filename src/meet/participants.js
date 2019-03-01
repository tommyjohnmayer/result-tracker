import React, { Component } from 'react';
import {
  DropdownButton,
  FormControl,
  MenuItem,
  Modal,
  Panel,
  Table
} from 'react-bootstrap';
import { DNF, PARTICIPANT, RESULT } from '../App';
import moment from 'moment';
import AddResultForm from './addResultForm';
import EditParticipantForm from './editParticipantForm';

class Participants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editParticipantsModalVisible: false,
      participantsToEdit: [],
      filterValue: ''
    };
  }

  updateFilter = event => {
    this.setState({
      filterValue: event.target.value
    });
  };

  showEditParticipantsModal = (show, competitor) => {
    const { events } = this.props;
    this.setState(prevState => {
      const participantsToEdit = events
        .reduce((acc, event) => {
          acc = [...acc, ...event.participants];
          return acc;
        }, [])
        .filter(participant => participant.competitor === competitor);
      return {
        editParticipantsModalVisible: show,
        participantsToEdit
      };
    });
  };

  render() {
    const {
      deleteEntity,
      addEntity,
      events,
      competitors,
      editEntity,
      edit
    } = this.props;
    const participants = events.reduce((acc, event) => {
      acc = [...acc, ...event.participants];
      return acc;
    }, []);
    const {
      editParticipantsModalVisible,
      participantsToEdit,
      filterValue
    } = this.state;
    const participantsByCompetitor = events
      .reduce((acc, event) => {
        acc = [...acc, ...event.participants];
        return acc;
      }, [])
      .filter(participant => {
        if (filterValue.trim() === '') {
          return true;
        }
        return (
          participant.division
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          competitors[participant.competitor].name
            .toLowerCase()
            .includes(filterValue.toLowerCase())
        );
      })
      .reduce((acc, participant) => {
        if (!acc[participant.competitor]) {
          const competitor = competitors[participant.competitor];
          acc[participant.competitor] = {
            ...competitor,
            participants: []
          };
        }
        participant.event_name = events.filter(
          event => event.id === participant.event
        )[0].name;
        acc[participant.competitor].participants.push(participant);
        return acc;
      }, {});

    return (
      <Panel defaultExpanded>
        <Panel.Heading>
          <Panel.Title>Participants</Panel.Title>
          <form
            onSubmit={event => {
              event.preventDefault();
            }}
          >
            <FormControl
              type="text"
              value={filterValue}
              name="filter"
              placeholder="Filter..."
              autoComplete="off"
              onChange={this.updateFilter}
            />
          </form>
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
                                  {edit && (
                                    <MenuItem
                                      key="edit-participants"
                                      onSelect={() =>
                                        this.showEditParticipantsModal(
                                          true,
                                          key
                                        )
                                      }
                                    >
                                      Edit
                                    </MenuItem>
                                  )}
                                  {edit &&
                                    events
                                      .filter(
                                        event =>
                                          !event.participants
                                            .map(p => p.competitor)
                                            .includes(participant.competitor)
                                      )
                                      .map(event => (
                                        <MenuItem
                                          key={event.id}
                                          eventKey={event.id}
                                          onSelect={() =>
                                            addEntity(PARTICIPANT, {
                                              competitor: key,
                                              event: event.id,
                                              meet: event.meet,
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
                                  {edit &&
                                    participants
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
                                              participant
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
                          {<td>{participant.event_name}</td>}
                          {edit && (
                            <td>
                              <AddResultForm
                                addEntity={addEntity}
                                participant={participant}
                              />
                            </td>
                          )}
                          {participant.results.map(result => (
                            <td key={result.id}>
                              <DropdownButton
                                bsStyle="link"
                                id="meet-menu"
                                title={
                                  result.time === DNF
                                    ? DNF
                                    : moment.duration(result.time).asMinutes() >
                                      1
                                    ? moment
                                        .utc(
                                          moment
                                            .duration(result.time)
                                            .as('milliseconds')
                                        )
                                        .format('m:ss.SS')
                                    : moment.duration(result.time).asSeconds()
                                }
                              >
                                {edit && (
                                  <MenuItem
                                    onSelect={() =>
                                      deleteEntity(RESULT, result)
                                    }
                                    eventKey="1"
                                  >
                                    delete
                                  </MenuItem>
                                )}
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
                      key={participant.id}
                      participant={participant}
                      events={events}
                      editEntity={editEntity}
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
