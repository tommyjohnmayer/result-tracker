import React, { Component } from "react";
import moment from "moment";
import { Col, Panel, Row, Table } from "react-bootstrap";

class Results extends Component {
  render() {
    const { events, competitors, results } = this.props;
    const participantBestResult = Object.keys(results)
      .map(key => results[key])
      .reduce((acc, result) => {
        if (!acc[result.participant]) {
          acc[result.participant] = result;
        }
        if (
          acc[result.participant].time.asMilliseconds() >
          result.time.asMilliseconds()
        ) {
          acc[result.participant] = result;
        }
        return acc;
      }, {});
    const resultsByEvent = Object.keys(events).map(key => {
      const divisions = Object.keys(participantBestResult)
        .map(pbrKey => participantBestResult[pbrKey])
        .filter(result => result.event === key)
        .reduce((acc, result) => {
          if (!acc[result.division]) {
            acc[result.division] = { name: result.division, results: [] };
          }
          const competitor = competitors[result.competitor];
          acc[result.division].results.push({
            ...result,
            competitor_name: competitor.name
          });
          return acc;
        }, {});
      return { ...events[key], divisions };
    });
    return (
      <Panel defaultExpanded>
        <Panel.Heading>
          <Panel.Title toggle>Results</Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body>
            <Row>
              {resultsByEvent.map(event => (
                <Col key={event.id} sm={4}>
                  <Panel>
                    <Panel.Heading>
                      <Panel.Title>{event.name}</Panel.Title>
                    </Panel.Heading>
                    <Table condensed>
                      {Object.keys(event.divisions).map(key => (
                        <React.Fragment key={key}>
                          <thead>
                            <tr>
                              <th colSpan="3">{event.divisions[key].name}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {event.divisions[key].results
                              .sort(
                                (a, b) =>
                                  a.time.asMilliseconds() -
                                  b.time.asMilliseconds()
                              )
                              .slice(0, 3)
                              .map((result, index) => (
                                <tr key={result.id}>
                                  <td>{index + 1}</td>
                                  <td>{result.competitor_name}</td>
                                  <td>
                                    {result.time.asMinutes() > 1
                                      ? moment
                                          .utc(result.time.as("milliseconds"))
                                          .format("m:ss.SS")
                                      : result.time.asSeconds()}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </React.Fragment>
                      ))}
                    </Table>
                  </Panel>
                </Col>
              ))}
            </Row>
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }
}

export default Results;
