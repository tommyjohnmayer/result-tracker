import React, { Component } from 'react';
import { Col, Grid, Navbar, Row } from 'react-bootstrap';
import Meets from './meets/';
import Meet from './meet/';
import Competitors from './competitors/';
import Competitor from './competitor/';

export const MEET = 'ENTITY/MEET';
export const EVENT = 'ENTITY/EVENT';
export const COMPETITOR = 'ENTITY/COMPETITOR';
export const PARTICIPANT = 'ENTITY/PARTICIPANT';
export const RESULT = 'ENTITY/RESULT';
const api_url = 'https://result-tracker-api.appspot.com';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {},
      meets: {},
      competitors: {},
      areMeetsLoaded: false,
      areCompetitorsLoaded: false
    };
  }

  componentDidMount() {
    fetch(api_url + '/meets')
      .then(res => res.json())
      .then(result => {
        const meets = result._embedded.meets.reduce((acc, meet) => {
          acc[meet.id] = meet;
          return acc;
        }, {});
        const selected = JSON.parse(localStorage.getItem('selected'));
        this.setState({
          meets,
          areMeetsLoaded: true,
          selected: selected ? selected : {}
        });
      });
    fetch(api_url + '/competitors')
      .then(res => res.json())
      .then(result => {
        const competitors = result._embedded.competitors.reduce(
          (acc, competitor) => {
            acc[competitor.id] = competitor;
            return acc;
          },
          {}
        );
        this.setState({
          competitors,
          areCompetitorsLoaded: true
        });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    const keys = ['meets', 'competitors', 'selected'];
    keys.forEach(key => {
      if (JSON.stringify(prevState[key]) !== JSON.stringify(this.state[key])) {
        localStorage.setItem(key, JSON.stringify(this.state[key]));
      }
    });
  }

  deleteEntity = (type, entity) => {
    switch (type) {
      case MEET:
        fetch(api_url + '/meets/' + entity.id, {
          method: 'DELETE'
        }).then(() => {
          this.setState(prevState => {
            const { [entity.id]: value, ...remainingMeets } = prevState.meets;
            const selected =
              prevState.selected.meet === entity.id ? {} : prevState.selected;
            return {
              meets: remainingMeets,
              selected
            };
          });
        });
        break;
      case EVENT:
        fetch(api_url + '/meets/' + entity.meet + '/events/' + entity.id, {
          method: 'DELETE'
        }).then(() => {
          this.setState(prevState => {
            const { event, ...newSelected } = prevState.selected;
            const updatedMeets = prevState.meets;
            updatedMeets[entity.meet].events = updatedMeets[
              entity.meet
            ].events.filter(e => e.id !== entity.id);
            return {
              meets: updatedMeets,
              selected: newSelected
            };
          });
        });
        break;
      case PARTICIPANT:
        fetch(
          api_url +
            '/meets/' +
            entity.meet +
            '/events/' +
            entity.event +
            '/participants/' +
            entity.id,
          {
            method: 'DELETE'
          }
        ).then(() => {
          this.setState(prevState => {
            const updatedMeet = prevState.meets[entity.meet];
            const eventToUpdate = updatedMeet.events.filter(
              event => event.id === entity.event
            )[0];
            eventToUpdate.participants = eventToUpdate.participants.filter(
              p => p.id !== entity.id
            );
            updatedMeet.events = updatedMeet.events.filter(
              event => event.id !== entity.event
            );
            updatedMeet.events = [...updatedMeet.events, eventToUpdate];
            return {
              meets: { ...prevState.meets, [updatedMeet.id]: updatedMeet }
            };
          });
        });
        break;
      case RESULT:
        fetch(
          api_url +
            '/meets/' +
            entity.meet +
            '/events/' +
            entity.event +
            '/participants/' +
            entity.participant +
            '/results/' +
            entity.id,
          {
            method: 'DELETE'
          }
        ).then(() => {
          this.setState(prevState => {
            const updatedMeet = prevState.meets[entity.meet];

            const eventToUpdate = updatedMeet.events.filter(
              event => event.id === entity.event
            )[0];

            const participantToUpdate = eventToUpdate.participants.filter(
              participant => participant.id === entity.participant
            )[0];

            participantToUpdate.results = participantToUpdate.results.filter(
              result => result.id !== entity.id
            );

            eventToUpdate.participants = eventToUpdate.participants.filter(
              participant => participant.id !== entity.participant
            );

            eventToUpdate.participants = [
              ...eventToUpdate.participants,
              participantToUpdate
            ];

            updatedMeet.events = updatedMeet.events.filter(
              event => event.id !== entity.event
            );
            updatedMeet.events = [...updatedMeet.events, eventToUpdate];
            return {
              meets: { ...prevState.meets, [updatedMeet.id]: updatedMeet }
            };
          });
        });
        break;
      default:
        console.log('operation not supported delete', type, entity);
        break;
    }
  };

  editEntity = (type, entity) => {
    switch (type) {
      case MEET:
        fetch(api_url + '/meets/' + entity.id, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...entity })
        })
          .then(res => res.json())
          .then(meet => {
            this.setState(prevState => ({
              meets: {
                ...prevState.meets,
                [meet.id]: { ...meet }
              }
            }));
          });
        break;
      case EVENT:
        fetch(api_url + '/meets/' + entity.meet + '/events/' + entity.id, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...entity })
        })
          .then(res => res.json())
          .then(event => {
            this.setState(prevState => {
              const updatedMeet = prevState.meets[event.meet];
              updatedMeet.events = updatedMeet.events.filter(
                e => e.id !== event.id
              );
              updatedMeet.events = [...updatedMeet.events, event];
              return {
                meets: {
                  ...prevState.meets,
                  [event.meet]: { ...updatedMeet }
                }
              };
            });
          });
        break;
      case PARTICIPANT:
        fetch(
          api_url +
            '/meets/' +
            entity.meet +
            '/events/' +
            entity.event +
            '/participants/' +
            entity.id,
          {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...entity })
          }
        )
          .then(res => res.json())
          .then(participant => {
            this.setState(prevState => {
              const updatedMeet = prevState.meets[entity.meet];
              const eventToUpdate = updatedMeet.events.filter(
                event => event.id === entity.event
              )[0];
              eventToUpdate.participants = eventToUpdate.participants.filter(
                p => p.id !== entity.id
              );
              eventToUpdate.participants = [
                ...eventToUpdate.participants,
                participant
              ];
              updatedMeet.events = updatedMeet.events.filter(
                event => event.id !== entity.event
              );
              updatedMeet.events = [...updatedMeet.events, eventToUpdate];
              return {
                meets: { ...prevState.meets, [updatedMeet.id]: updatedMeet }
              };
            });
          });
        break;
      case COMPETITOR:
        fetch(api_url + '/competitors/' + entity.id, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...entity })
        })
          .then(res => res.json())
          .then(competitor => {
            this.setState(prevState => ({
              competitors: {
                ...prevState.competitors,
                [competitor.id]: { ...competitor }
              }
            }));
          });
        break;
      default:
        console.log('operation not supported edit', type, entity);
        break;
    }
  };

  addEntity = (type, entity) => {
    switch (type) {
      case MEET:
        let meetId;
        fetch(api_url + '/meets', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...entity })
        })
          .then(res => res.json())
          .then(meet => {
            this.setState(prevState => ({
              meets: {
                ...prevState.meets,
                [meet.id]: { ...meet }
              }
            }));
            meetId = meet.id;
          });
        return meetId;
      case EVENT:
        let eventId;
        fetch(api_url + '/meets/' + entity.meet + '/events', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...entity })
        })
          .then(res => res.json())
          .then(event => {
            this.setState(prevState => {
              const updatedMeet = prevState.meets[event.meet];
              updatedMeet.events = [...updatedMeet.events, event];
              return {
                meets: { ...prevState.meets, [updatedMeet.id]: updatedMeet }
              };
            });
            eventId = event.id;
          });
        return eventId;
      case PARTICIPANT:
        let participantId;
        const event = this.state.meets[entity.meet].events.filter(
          event => event.id === entity.event
        )[0];
        const order =
          event.participants.reduce((acc, participant) => {
            return Math.max(acc, participant.order);
          }, 0) + 1;
        fetch(
          api_url +
            '/meets/' +
            entity.meet +
            '/events/' +
            entity.event +
            '/participants',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...entity, order })
          }
        )
          .then(res => res.json())
          .then(participant => {
            this.setState(prevState => {
              const updatedMeet = prevState.meets[participant.meet];
              updatedMeet.events.filter(
                event => event.id === participant.event
              )[0].participants = [
                ...updatedMeet.events.filter(
                  event => event.id === participant.event
                )[0].participants,
                participant
              ];
              return {
                meets: { ...prevState.meets, [updatedMeet.id]: updatedMeet }
              };
            });
            participantId = participant.id;
          });
        return participantId;
      case RESULT:
        let resultId;
        fetch(
          api_url +
            '/meets/' +
            entity.meet +
            '/events/' +
            entity.event +
            '/participants/' +
            entity.participant +
            '/results',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...entity })
          }
        )
          .then(res => res.json())
          .then(result => {
            this.setState(prevState => {
              const updatedMeet = prevState.meets[result.meet];
              updatedMeet.events
                .filter(event => event.id === result.event)[0]
                .participants.filter(
                  participant => participant.id === result.participant
                )[0].results = [
                ...updatedMeet.events
                  .filter(event => event.id === result.event)[0]
                  .participants.filter(
                    participant => participant.id === result.participant
                  )[0].results,
                result
              ];
              return {
                meets: { ...prevState.meets, [updatedMeet.id]: updatedMeet }
              };
            });
            resultId = result.id;
          });
        return resultId;
      case COMPETITOR:
        let competitorId;
        fetch(api_url + '/competitors', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...entity })
        })
          .then(res => res.json())
          .then(competitor => {
            this.setState(prevState => ({
              competitors: {
                ...prevState.competitors,
                [competitor.id]: { ...competitor }
              }
            }));
            competitorId = competitor.id;
          });
        return competitorId;
      default:
        console.log('operation not supported add', type, entity);
        break;
    }
  };

  selectEntity = (type, id) => {
    switch (type) {
      case MEET:
        this.setState({
          selected: { meet: id }
        });
        break;
      case EVENT:
        this.setState(prevState => ({
          selected: { ...prevState.selected, event: id }
        }));
        break;
      case COMPETITOR:
        this.setState({
          selected: { competitor: id }
        });
        break;
      default:
        console.log('operation not supported select', type, id);
        break;
    }
  };

  render() {
    const {
      meets,
      competitors,
      selected,
      areMeetsLoaded,
      areCompetitorsLoaded
    } = this.state;
    const selectedMeet = meets[selected.meet] ? meets[selected.meet] : {};
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
                  areMeetsLoaded={areMeetsLoaded}
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
                  areCompetitorsLoaded={areCompetitorsLoaded}
                />
              </Col>
            </Row>
          </Col>
          <Col sm={9}>
            {selected.meet && (
              <Meet
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
