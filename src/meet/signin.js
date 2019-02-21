import React, { Component } from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  FormGroup,
  ListGroup,
  ListGroupItem,
  Panel
} from 'react-bootstrap';
import { PARTICIPANT } from '../App';
import { Typeahead } from 'react-bootstrap-typeahead';

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newParticipantCompetitor: '',
      newParticipantDivision: '',
      newParticipantEvents: [],
      selectedCompetitor: []
    };
  }

  typeAhead = value => {
    const competitor = value[0];
    if (competitor) {
      this.setState({
        newParticipantCompetitor: competitor.id,
        newParticipantDivision: competitor.division,
        selectedCompetitor: [value[0]]
      });
    } else {
      this.clearSignin();
    }
  };

  clearSignin = () => {
    this.setState({
      newParticipantCompetitor: '',
      newParticipantDivision: '',
      selectedCompetitor: []
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

  toggleEvent = (event, data) => {
    const { events } = this.props;
    let updatedEvents = this.state.newParticipantEvents;
    if (event.target.checked) {
      updatedEvents.push(data.id);
    } else {
      updatedEvents = updatedEvents.filter(id => id !== data.id);
    }
    this.setState({
      newParticipantEvents: updatedEvents.filter(
        ev => events.filter(event => event.id === ev).length > 0
      )
    });
  };

  render() {
    const { events, competitors } = this.props;
    const registeredCompetitorKeys = events.reduce((acc, event) => {
      acc.push(
        ...event.participants.map(participant => participant.competitor)
      );
      return acc;
    }, []);
    const { newParticipantDivision, selectedCompetitor } = this.state;
    const unregisteredCompetitors = Object.keys(competitors)
      .filter(key => !registeredCompetitorKeys.includes(key))
      .map(key => competitors[key])
      .sort((a, b) => a.name.localeCompare(b.name));
    return (
      <Panel defaultExpanded>
        <Panel.Heading>
          <Panel.Title toggle>Sign in</Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <ListGroup>
            <ListGroupItem>
              <form onSubmit={this.addParticipant}>
                <Typeahead
                  labelKey="name"
                  options={unregisteredCompetitors}
                  placeholder="select competitor..."
                  onChange={this.typeAhead}
                  selected={selectedCompetitor}
                />
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
