import React, { Component } from 'react';
import {
  Button,
  FormControl,
  ListGroup,
  ListGroupItem,
  Panel
} from 'react-bootstrap';
import { COMPETITOR } from '../App';

class Competitors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newCompetitor: { name: '', division: '' }
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

  addCompetitor = event => {
    event.preventDefault();
    const { addEntity } = this.props;
    const { newCompetitor } = this.state;
    if (newCompetitor.name.trim() !== '') {
      addEntity(COMPETITOR, newCompetitor);
      this.setState({
        newCompetitor: { name: '', division: '' }
      });
    }
  };

  render() {
    const { competitors, selected, selectEntity, edit } = this.props;
    const { newCompetitor } = this.state;
    return (
      <Panel defaultExpanded>
        <Panel.Heading>
          <Panel.Title toggle>Competitors</Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <ListGroup>
            {edit && (
              <ListGroupItem>
                <form className="new-competitor" onSubmit={this.addCompetitor}>
                  <FormControl
                    className="new-competitor-name"
                    type="text"
                    value={newCompetitor.name}
                    name="name"
                    placeholder="Enter New Competitor"
                    onChange={this.handleChange}
                    data-object="newCompetitor"
                    autoComplete="off"
                  />
                  <FormControl
                    className="new-competitor-division"
                    type="text"
                    value={newCompetitor.division}
                    name="division"
                    placeholder="Enter Division"
                    onChange={this.handleChange}
                    data-object="newCompetitor"
                    autoComplete="off"
                  />
                  <Button
                    bsStyle="primary"
                    type="submit"
                    className="new-competitor-submit"
                  >
                    add competitor
                  </Button>
                </form>
              </ListGroupItem>
            )}
            {Object.keys(competitors)
              .map(key => competitors[key])
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(competitor => (
                <ListGroupItem
                  className="competitor-selector"
                  onClick={() => selectEntity(COMPETITOR, competitor.id)}
                  active={selected.competitor === competitor.id}
                  header={competitor.name}
                  key={competitor.id}
                />
              ))}
          </ListGroup>
        </Panel.Collapse>
      </Panel>
    );
  }
}

export default Competitors;
