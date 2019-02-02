import React, { Component } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormGroup,
  ListGroup,
  ListGroupItem,
  Panel
} from "react-bootstrap";
import { PARTICIPANT } from "../App";

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newParticipantCompetitor: 0,
      newParticipantDivision: "",
      newParticipantEvents: []
    };
  }

  clearSignin = () => {
    this.setState({
      newParticipantCompetitor: 0,
      newParticipantDivision: ""
    });
  };

  handleChange = event => {
    this.setState({
      newParticipantDivision: event.target.value
    });
  };

  addParticipant = event => {
    event.preventDefault();
    const {
      newParticipantCompetitor,
      newParticipantEvents,
      newParticipantDivision
    } = this.state;
    const { addEntity, selected } = this.props;
    const partialParticipant = {
      competitor: newParticipantCompetitor,
      meet: selected.meet,
      division: newParticipantDivision
    };
    if (newParticipantCompetitor !== 0 && newParticipantEvents.length > 0) {
      for (var i = 0; i < newParticipantEvents.length; i++) {
        addEntity(PARTICIPANT, {
          ...partialParticipant,
          event: newParticipantEvents[i]
        });
      }
      this.clearSignin();
    }
  };

  enterNewParticipantCompetitor = event => {
    const { competitors } = this.props;
    const competitor = competitors[event.target.value];
    if (competitor) {
      this.setState({
        newParticipantCompetitor: competitor.id,
        newParticipantDivision: competitor.division
      });
    } else {
      this.clearSignin();
    }
  };

  toggleEvent = (event, data) => {
    const { events } = this.props;
    let updatedEvents = this.state.newParticipantEvents;
    if (event.target.checked) {
      updatedEvents.push(data.id);
    } else {
      updatedEvents = updatedEvents.filter(id => id !== data.id);
    }
    this.setState({
      newParticipantEvents: updatedEvents.filter(ev =>
        Object.keys(events).includes(ev)
      )
    });
  };

  render() {
    const { events, participants, competitors } = this.props;
    const { newParticipantDivision } = this.state;
    const registeredCompetitorKeys = Object.keys(participants).map(
      key => participants[key].competitor
    );
    const unregisteredCompetitors = Object.keys(competitors)
      .filter(key => !registeredCompetitorKeys.includes(key))
      .map(key => competitors[key]);
    return (
      <Panel defaultExpanded>
        <Panel.Heading>
          <Panel.Title toggle>Sign in</Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <ListGroup>
            <ListGroupItem>
              <form onSubmit={this.addParticipant}>
                <FormControl
                  componentClass="select"
                  placeholder="select competitor"
                  onChange={this.enterNewParticipantCompetitor}
                >
                  <option key="0" value="0">
                    Add...
                  </option>
                  {unregisteredCompetitors.map(competitor => (
                    <option
                      key={competitor.id}
                      id={competitor.id}
                      value={competitor.id}
                    >
                      {competitor.name}
                    </option>
                  ))}
                </FormControl>
                <FormControl
                  type="text"
                  value={newParticipantDivision}
                  name="division"
                  placeholder="Enter Division"
                  onChange={this.handleChange}
                  autoComplete="off"
                />
                <FormGroup>
                  {Object.keys(events).map(key => (
                    <Checkbox
                      onChange={e => this.toggleEvent(e, events[key])}
                      key={key}
                    >
                      {events[key].name}
                    </Checkbox>
                  ))}
                </FormGroup>
                <Button bsStyle="primary" type="submit">
                  register
                </Button>
              </form>
            </ListGroupItem>
          </ListGroup>
        </Panel.Collapse>
      </Panel>
    );
  }
}

export default Signin;
