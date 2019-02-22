import React, { Component } from 'react';
import moment from 'moment';
import { Button, Col, Glyphicon, Panel, Row, Table } from 'react-bootstrap';
import { MEET } from '../App';

class Results extends Component {
  render() {
    const { competitors, getEntity, meet } = this.props;
    const { events = [] } = meet;
    const eventsWithParticipantsByDivision = events.map(event => {
      event.divisions = event.participants.reduce((acc, participant) => {
        if (!acc[participant.division]) {
          acc[participant.division] = [];
        }
        participant.total_time = participant.results.reduce((rAcc, result) => {
          return rAcc.add(moment.duration(result.time));
        }, moment.duration(0));
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
            <Button bsStyle="default" onClick={() => getEntity(MEET, meet)}>
              <Glyphicon glyph="refresh" />
            </Button>
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
                              </tr>
                            </thead>
                            {results
                              .sort(
                                (a, b) =>
                                  moment
                                    .duration(a.total_time)
                                    .asMilliseconds() -
                                  moment.duration(b.total_time).asMilliseconds()
                              )
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
                                      <td>
                                        {moment
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
                                      </td>
                                      {participant.results.map(result => {
                                        return (
                                          <td key={result.id}>
                                            {moment
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
