import React, { Component } from "react";
import moment from "moment";
import { Col, Grid, Navbar, Row } from "react-bootstrap";
import Meets from "./meets/";
import Meet from "./meet/";
import Competitors from "./competitors/";
import Competitor from "./competitor/";
import UUID from "uuid/v4";

export const MEET = "ENTITY/MEET";
export const EVENT = "ENTITY/EVENT";
export const COMPETITOR = "ENTITY/COMPETITOR";
export const PARTICIPANT = "ENTITY/PARTICIPANT";
export const RESULT = "ENTITY/RESULT";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {},
      meets: {},
      competitors: {},
      events: {},
      participants: {},
      results: {}
    };
  }

  componentDidMount() {
    const keys = [
      "meets",
      "competitors",
      "events",
      "participants",
      "results",
      "selected"
    ];
    keys.forEach(key => {
      const entity = JSON.parse(localStorage.getItem(key));
      if (entity) {
        if (key === "results") {
          Object.keys(entity).forEach(eKey => {
            entity[eKey].time = moment.duration(entity[eKey].time);
          });
        }
        this.setState({
          [key]: entity
        });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const keys = [
      "meets",
      "competitors",
      "events",
      "participants",
      "results",
      "selected"
    ];
    keys.forEach(key => {
      if (JSON.stringify(prevState[key]) !== JSON.stringify(this.state[key])) {
        localStorage.setItem(key, JSON.stringify(this.state[key]));
      }
    });
  }

  deleteEntity = (type, id) => {
    const { selected } = this.state;
    let newSelected;
    switch (type) {
      case MEET:
        newSelected = selected.meet === id ? {} : selected;
        this.setState(prevState => {
          const { [id]: value, ...remainingMeets } = prevState.meets;
          const remainingEvents = Object.keys(prevState.events).reduce(
            (acc, key) => {
              if (prevState.events[key].meet !== id) {
                acc[key] = prevState.events[key];
              }
              return acc;
            },
            {}
          );
          const remainingParticipants = Object.keys(
            prevState.participants
          ).reduce((acc, key) => {
            if (prevState.participants[key].meet !== id) {
              acc[key] = prevState.participants[key];
            }
            return acc;
          }, {});
          const remainingResults = Object.keys(prevState.results).reduce(
            (acc, key) => {
              if (prevState.results[key].meet !== id) {
                acc[key] = prevState.results[key];
              }
              return acc;
            },
            {}
          );
          return {
            meets: remainingMeets,
            events: remainingEvents,
            participants: remainingParticipants,
            results: remainingResults,
            selected: newSelected
          };
        });
        break;
      case EVENT:
        newSelected = selected;
        if (selected.event === id) {
          newSelected = { meet: selected.meet };
        }
        this.setState(prevState => {
          const { [id]: value, ...remainingEvents } = prevState.events;
          const remainingParticipants = Object.keys(
            prevState.participants
          ).reduce((acc, key) => {
            if (prevState.participants[key].event !== id) {
              acc[key] = prevState.participants[key];
            }
            return acc;
          }, {});
          const remainingResults = Object.keys(prevState.results).reduce(
            (acc, key) => {
              if (prevState.results[key].event !== id) {
                acc[key] = prevState.results[key];
              }
              return acc;
            },
            {}
          );
          return {
            events: remainingEvents,
            participants: remainingParticipants,
            results: remainingResults,
            selected: newSelected
          };
        });
        break;
      case PARTICIPANT:
        this.setState(prevState => {
          const {
            [id]: value,
            ...remainingParticipants
          } = prevState.participants;
          const remainingResults = Object.keys(prevState.results).reduce(
            (acc, key) => {
              if (prevState.results[key].participant !== id) {
                acc[key] = prevState.results[key];
              }
              return acc;
            },
            {}
          );
          return {
            participants: remainingParticipants,
            results: remainingResults
          };
        });
        break;
      case RESULT:
        this.setState(prevState => {
          const { [id]: value, ...remainingResults } = prevState.results;
          return {
            results: remainingResults
          };
        });
        break;
      case COMPETITOR:
        this.setState(prevState => {
          const {
            [id]: value,
            ...remainingCompetitors
          } = prevState.competitors;
          const remainingParticipants = Object.keys(
            prevState.participants
          ).reduce((acc, key) => {
            if (prevState.participants[key].competitor !== id) {
              acc[key] = prevState.participants[key];
            }
            return acc;
          }, {});
          const remainingResults = Object.keys(prevState.results)
            .filter(key => prevState.results[key].competitor !== id)
            .reduce((acc, key) => {
              if (prevState.results[key].competitor !== id) {
                acc[key] = prevState.results[key];
              }
              return acc;
            }, {});
          return {
            competitors: remainingCompetitors,
            participants: remainingParticipants,
            results: remainingResults,
            selected: {}
          };
        });
        break;
      default:
        break;
    }
  };

  editEntity = (type, entity) => {
    switch (type) {
      case MEET:
        this.setState(prevState => ({
          meets: { ...prevState.meets, [entity.id]: entity }
        }));
        break;
      case EVENT:
        this.setState(prevState => ({
          events: { ...prevState.events, [entity.id]: entity }
        }));
        break;
      case COMPETITOR:
        this.setState(prevState => ({
          competitors: { ...prevState.competitors, [entity.id]: entity }
        }));
        break;
      case PARTICIPANT:
        this.setState(prevState => ({
          participants: { ...prevState.participants, [entity.id]: entity }
        }));
        break;
      default:
        break;
    }
  };

  addEntity = (type, entity) => {
    const id = UUID();
    switch (type) {
      case MEET:
        this.setState(prevState => ({
          meets: {
            ...prevState.meets,
            [id]: { ...entity, id }
          }
        }));
        return id;
      case EVENT:
        this.setState(prevState => ({
          events: {
            ...prevState.events,
            [id]: { ...entity, id }
          }
        }));
        return id;
      case PARTICIPANT:
        this.setState(prevState => {
          const order =
            Object.keys(prevState.participants)
              .filter(key => prevState.participants[key].event === entity.event)
              .reduce((acc, key) => {
                return Math.max(acc, prevState.participants[key].order);
              }, 0) + 1;
          return {
            participants: {
              ...prevState.participants,
              [id]: { ...entity, id, order }
            }
          };
        });
        return id;
      case RESULT:
        this.setState(prevState => ({
          results: {
            ...prevState.results,
            [id]: { ...entity, id }
          }
        }));
        return id;
      case COMPETITOR:
        this.setState(prevState => ({
          competitors: {
            ...prevState.competitors,
            [id]: { ...entity, id }
          }
        }));
        return id;
      default:
        break;
    }
  };

  selectEntity = (type, id) => {
    const { events } = this.state;
    switch (type) {
      case MEET:
        this.setState({
          selected: { meet: id }
        });
        break;
      case EVENT:
        const event = events[id];
        this.setState({
          selected: { meet: event.meet, event: id }
        });
        break;
      case COMPETITOR:
        this.setState({
          selected: { competitor: id }
        });
        break;
      default:
        break;
    }
  };

  render() {
    const {
      meets,
      events,
      participants,
      competitors,
      results,
      selected
    } = this.state;
    const selectedMeet = meets[selected.meet];
    const selectedCompetitor = competitors[selected.competitor];
    return (
      <Grid className="App">
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#home">Live Result Tracker</a>
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
        <Row>
          <Col sm={3}>
            <Row>
              <Col sm={12}>
                <Meets
                  meets={meets}
                  selected={selected}
                  selectEntity={this.selectEntity}
                  addEntity={this.addEntity}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Competitors
                  competitors={competitors}
                  addEntity={this.addEntity}
                  selected={selected}
                  selectEntity={this.selectEntity}
                />
              </Col>
            </Row>
          </Col>
          <Col sm={9}>
            {selected.meet && (
              <Meet
                events={Object.keys(events).reduce((acc, key) => {
                  if (events[key].meet === selected.meet) {
                    acc[key] = events[key];
                  }
                  return acc;
                }, {})}
                participants={Object.keys(participants).reduce((acc, key) => {
                  if (participants[key].meet === selected.meet) {
                    acc[key] = participants[key];
                  }
                  return acc;
                }, {})}
                results={Object.keys(results).reduce((acc, key) => {
                  if ((results[key].meet = selected.meet)) {
                    acc[key] = results[key];
                  }
                  return acc;
                }, {})}
                competitors={competitors}
                meet={selectedMeet}
                selected={selected}
                selectEntity={this.selectEntity}
                addEntity={this.addEntity}
                deleteEntity={this.deleteEntity}
                editEntity={this.editEntity}
              />
            )}
            {selected.competitor && (
              <Competitor
                competitor={selectedCompetitor}
                deleteEntity={this.deleteEntity}
                editEntity={this.editEntity}
              />
            )}
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
