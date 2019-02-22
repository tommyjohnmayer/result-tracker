import React, { Component } from 'react';
import {
  Button,
  Col,
  DropdownButton,
  FormControl,
  Glyphicon,
  ListGroupItem,
  MenuItem,
  Modal,
  Panel,
  Row
} from 'react-bootstrap';
import { MEET } from '../App';
import Signin from './signin';
import Events from './events';
import Participants from './participants';
import Event from './event';
import Results from './results';
import Loader from 'react-loader-spinner';

class Meet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMeetModalVisible: false,
      updateMeet: {}
    };
  }

  updateMeet = event => {
    event.preventDefault();
    const { editEntity } = this.props;
    const { updateMeet } = this.state;
    editEntity(MEET, updateMeet);
    this.showEditMeetModal(false);
  };

  handleChange = event => {
    this.setState({
      [event.target.dataset.object]: {
        ...this.state[event.target.dataset.object],
        [event.target.name]: event.target.value
      }
    });
  };

  showEditMeetModal = show => {
    this.setState({
      editMeetModalVisible: show,
      updateMeet: this.props.meet
    });
  };

  render() {
    const {
      deleteEntity,
      meet = {},
      competitors,
      selectEntity,
      selected,
      editEntity,
      addEntity,
      edit,
      getEntity,
      loaded
    } = this.props;
    const { events = [] } = meet;
    document.title = meet.name;
    const { editMeetModalVisible, updateMeet } = this.state;
    const selectedEvent = events.filter(
      event => event.id === selected.event
    )[0];
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title>
            {meet.name}
            {edit && (
              <DropdownButton
                bsStyle="link"
                id="meet-menu"
                noCaret
                title={<Glyphicon glyph="menu-hamburger" />}
              >
                <MenuItem
                  onSelect={() => this.showEditMeetModal(true)}
                  eventKey="edit"
                >
                  edit
                </MenuItem>
                <MenuItem divider />
                <MenuItem
                  onSelect={() => deleteEntity(MEET, meet)}
                  eventKey="delete"
                >
                  delete
                </MenuItem>
              </DropdownButton>
            )}
            &nbsp;
            <Button bsStyle="default" onClick={() => getEntity(MEET, meet)}>
              <Glyphicon glyph="refresh" />
            </Button>
          </Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          {!loaded && (
            <ListGroupItem>
              <Loader
                type="Ball-Triangle"
                color="#286090"
                height="80"
                width="100%"
              />
            </ListGroupItem>
          )}
          {loaded && (
            <Row>
              <Col sm={3}>
                {edit && (
                  <Signin
                    events={events}
                    addEntity={addEntity}
                    selected={selected}
                    competitors={competitors}
                  />
                )}
                <Events
                  events={events}
                  selectEntity={selectEntity}
                  selected={selected}
                  addEntity={addEntity}
                  edit={edit}
                />
              </Col>
              <Col sm={9}>
                {selected.event && (
                  <Event
                    competitors={competitors}
                    addEntity={addEntity}
                    deleteEntity={deleteEntity}
                    editEntity={editEntity}
                    event={selectedEvent}
                    edit={edit}
                  />
                )}
                {!selected.event && (
                  <Participants
                    deleteEntity={deleteEntity}
                    addEntity={addEntity}
                    editEntity={editEntity}
                    events={events}
                    competitors={competitors}
                    edit={edit}
                  />
                )}
                <Results
                  competitors={competitors}
                  getEntity={getEntity}
                  meet={meet}
                />
              </Col>
            </Row>
          )}
        </Panel.Body>
        <Modal
          show={editMeetModalVisible}
          onHide={() => this.showEditMeetModal(false)}
        >
          <Panel>
            <Panel.Heading>{meet.name}</Panel.Heading>

            <Panel.Body>
              <form onSubmit={this.updateMeet}>
                <FormControl
                  type="text"
                  value={updateMeet.name}
                  name="name"
                  placeholder="Enter Meet Name"
                  onChange={this.handleChange}
                  data-object="updateMeet"
                  autoComplete="off"
                />
                <FormControl
                  type="text"
                  value={updateMeet.date}
                  name="date"
                  placeholder="Enter Meet Date"
                  onChange={this.handleChange}
                  data-object="updateMeet"
                  autoComplete="off"
                />
                <Button bsStyle="primary" type="submit">
                  update meet
                </Button>
              </form>
            </Panel.Body>
          </Panel>
        </Modal>
      </Panel>
    );
  }
}

export default Meet;
