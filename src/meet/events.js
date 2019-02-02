import React, { Component } from "react";
import {
  Badge,
  Button,
  FormControl,
  ListGroup,
  ListGroupItem,
  Panel
} from "react-bootstrap";
import { EVENT, MEET } from "../App";

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newEvent: { name: "" }
    };
  }

  selectEvent = id => {
    const { selected } = this.props;
    if (selected.event === id) {
      this.props.selectEntity(MEET, selected.meet);
    } else {
      this.props.selectEntity(EVENT, id);
    }
  };

  addEvent = event => {
    event.preventDefault();
    const { addEntity, selected } = this.props;
    const { newEvent } = this.state;
    if (newEvent.name.trim() !== "") {
      addEntity(EVENT, { ...newEvent, meet: selected.meet });
      this.setState({
        newEvent: { name: "" }
      });
    }
  };

  handleChange = event => {
    this.setState({
      [event.target.dataset.object]: {
        ...this.state[event.target.dataset.object],
        [event.target.name]: event.target.value
      }
    });
  };

  render() {
    const { newEvent } = this.state;
    const { events, selected, participants } = this.props;
    return (
      <Panel defaultExpanded>
        <Panel.Heading>
          <Panel.Title toggle>Events</Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <ListGroup>
            {Object.keys(events).map(key => (
              <ListGroupItem
                key={key}
                onClick={() => this.selectEvent(key)}
                active={selected.event === key}
              >
                <h4 className="list-group-item-heading">
                  {events[key].name}
                  &nbsp;
                  <Badge>
                    {
                      Object.keys(participants).filter(
                        pkey => participants[pkey].event === key
                      ).length
                    }
                  </Badge>
                </h4>
              </ListGroupItem>
            ))}
            <ListGroupItem>
              <form onSubmit={this.addEvent}>
                <FormControl
                  type="text"
                  value={newEvent.name}
                  name="name"
                  data-object="newEvent"
                  placeholder="Enter Event"
                  onChange={this.handleChange}
                  autoComplete="off"
                />

                <Button bsStyle="primary" type="submit">
                  add event
                </Button>
              </form>
            </ListGroupItem>
          </ListGroup>
        </Panel.Collapse>
      </Panel>
    );
  }
}

export default Events;
