import React, { Component } from 'react';
import {
  Button,
  FormControl,
  ListGroup,
  ListGroupItem,
  Panel
} from 'react-bootstrap';
import { MEET } from '../App';
import Loader from 'react-loader-spinner';

class Meets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newEntity: { name: '', date: '' }
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
    const { addEntity } = this.props;
    const { newEntity } = this.state;
    if (newEntity.name.trim() !== '') {
      addEntity(MEET, newEntity);
      this.setState({
        newEntity: { name: '', date: '' }
      });
    }
  };

  render() {
    const { meets, selected, selectEntity, edit, loaded } = this.props;
    const { newEntity } = this.state;
    return (
      <Panel defaultExpanded>
        <Panel.Heading>
          <Panel.Title toggle>Meets</Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <ListGroup>
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
            {edit && (
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
            )}
            {Object.keys(meets)
              .map(key => meets[key])
              .sort((a, b) => b.date.localeCompare(a.date))
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
          </ListGroup>
        </Panel.Collapse>
      </Panel>
    );
  }
}

export default Meets;
