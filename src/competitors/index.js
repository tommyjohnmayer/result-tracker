import React, { Component } from 'react';
import {
  Button,
  FormControl,
  ListGroup,
  ListGroupItem,
  Panel
} from 'react-bootstrap';
import { COMPETITOR } from '../App';
import Loader from 'react-loader-spinner';

class Competitors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newCompetitor: { name: '', division: '' },
      filterValue: ''
    };
  }

  updateFilter = event => {
    this.setState({
      filterValue: event.target.value
    });
  };

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
    const { competitors, selected, selectEntity, edit, loaded } = this.props;
    const { newCompetitor, filterValue } = this.state;
    return (
      <Panel defaultExpanded>
        <Panel.Heading>
          <Panel.Title toggle>Competitors</Panel.Title>
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
              .filter(competitor => {
                if (filterValue.trim() === '') {
                  return true;
                }
                return (
                  competitor.division
                    .toLowerCase()
                    .includes(filterValue.toLowerCase()) ||
                  competitor.name
                    .toLowerCase()
                    .includes(filterValue.toLowerCase())
                );
              })
              .sort((a, b) => a.name.localeCompare(b.name))
              .slice(0, 12)
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
