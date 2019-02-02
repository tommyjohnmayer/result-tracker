import React, { Component } from "react";
import {
  Button,
  FormControl,
  ListGroup,
  ListGroupItem,
  Panel
} from "react-bootstrap";
import { MEET } from "../App";

class Meets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newEntity: { name: "", date: "" }
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

  addMeet = event => {
    event.preventDefault();
    const { addEntity, selectEntity } = this.props;
    const { newEntity } = this.state;
    if (newEntity.name.trim() !== "") {
      const meetId = addEntity(MEET, newEntity);
      selectEntity(MEET, meetId);
      this.setState({
        newEntity: { name: "", date: "" }
      });
    }
  };

  render() {
    const { meets, selected, selectEntity } = this.props;
    const { newEntity } = this.state;
    return (
      <Panel defaultExpanded>
        <Panel.Heading>
          <Panel.Title toggle>Meets</Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <ListGroup>
            {Object.keys(meets)
              .map(key => meets[key])
              .map(meet => (
                <ListGroupItem
                  className="meet-selector"
                  key={meet.id}
                  header={meet.name}
                  onClick={() => selectEntity(MEET, meet.id)}
                  active={selected.meet === meet.id}
                >
                  {meet.date}
                </ListGroupItem>
              ))}
            <ListGroupItem>
              <form className="new-meet" onSubmit={this.addMeet}>
                <FormControl
                  className="new-meet-name"
                  type="text"
                  value={newEntity.name}
                  name="name"
                  placeholder="Enter Meet Name"
                  onChange={this.handleChange}
                  data-object="newEntity"
                  autoComplete="off"
                />
                <FormControl
                  className="new-meet-date"
                  type="text"
                  value={newEntity.date}
                  name="date"
                  placeholder="Enter Meet Date"
                  onChange={this.handleChange}
                  data-object="newEntity"
                  autoComplete="off"
                />
                <Button
                  className="new-meet-submit"
                  bsStyle="primary"
                  type="submit"
                >
                  add meet
                </Button>
              </form>
            </ListGroupItem>
          </ListGroup>
        </Panel.Collapse>
      </Panel>
    );
  }
}

export default Meets;
