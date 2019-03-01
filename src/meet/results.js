import React, { Component } from 'react';
import moment from 'moment';
import { Col, FormControl, Panel, Row, Table } from 'react-bootstrap';
import { DNF } from '../App';

class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterValue: ''
    };
  }

  updateFilter = event => {
    this.setState({
      filterValue: event.target.value
    });
  };

  render() {
    const { filterValue } = this.state;
    const { competitors, meet } = this.props;
    const { events = [] } = meet;
    const eventsWithParticipantsByDivision = events.map(event => {
      event.divisions = event.participants
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
          if (!acc[participant.division]) {
            acc[participant.division] = [];
          }
          participant.total_time = participant.results.reduce(
            (rAcc, result) => {
              if (rAcc === DNF || result.time === DNF) {
                return DNF;
              }
              return rAcc.add(moment.duration(result.time));
            },
            moment.duration(0)
          );
          acc[participant.division].push(participant);
          return acc;
        }, {});

      return event;
    });
    return (
      <Panel defaultExpanded>
        <Panel.Heading>
          <Panel.Title>
            Results&nbsp;
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
          </Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Row>
            {eventsWithParticipantsByDivision.map(event => (
              <Col key={event.id} sm={6}>
                <Panel>
                  <Panel.Heading>
                    <Panel.Title>{event.name}</Panel.Title>
                  </Panel.Heading>
                  <Table>
                    {Object.keys(event.divisions)
                      .sort((a, b) => a.localeCompare(b))
                      .map(key => event.divisions[key])
                      .map(results => {
                        return (
                          <React.Fragment key={results[0].division}>
                            <thead>
                              <tr>
                                <th>{results[0].division}</th>
                                <th>total</th>
                                <td>run 1</td>
                                <td>run 2</td>
                              </tr>
                            </thead>
                            {results
                              .sort((a, b) => {
                                if (a.total_time === DNF) {
                                  return 1;
                                }
                                if (b.total_time === DNF) {
                                  return -1;
                                }
                                return (
                                  moment
                                    .duration(a.total_time)
                                    .asMilliseconds() -
                                  moment.duration(b.total_time).asMilliseconds()
                                );
                              })
                              .map(participant => {
                                return (
                                  <tbody key={participant.id}>
                                    <tr>
                                      <td>
                                        {
                                          competitors[participant.competitor]
                                            .name
                                        }
                                      </td>
                                      <th>
                                        {participant.total_time === DNF
                                          ? DNF
                                          : moment
                                              .duration(participant.total_time)
                                              .asMinutes() > 1
                                          ? moment
                                              .utc(
                                                moment
                                                  .duration(
                                                    participant.total_time
                                                  )
                                                  .as('milliseconds')
                                              )
                                              .format('m:ss.SS')
                                          : moment
                                              .duration(participant.total_time)
                                              .asSeconds()}
                                      </th>
                                      {participant.results.map(result => {
                                        return (
                                          <td key={result.id}>
                                            {result.time === DNF
                                              ? DNF
                                              : moment
                                                  .duration(result.time)
                                                  .asMinutes() > 1
                                              ? moment
                                                  .utc(
                                                    moment
                                                      .duration(result.time)
                                                      .as('milliseconds')
                                                  )
                                                  .format('m:ss.SS')
                                              : moment
                                                  .duration(result.time)
                                                  .asSeconds()}
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  </tbody>
                                );
                              })}
                          </React.Fragment>
                        );
                      })}
                  </Table>
                </Panel>
              </Col>
            ))}
          </Row>
        </Panel.Body>
      </Panel>
    );
  }
}

export default Results;
