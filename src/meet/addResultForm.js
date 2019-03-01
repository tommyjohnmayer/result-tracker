import React, { Component } from 'react';
import { Form, FormControl, FormGroup } from 'react-bootstrap';
import { DNF, RESULT } from '../App';
import moment from 'moment';

class AddResultForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newResult: {
        participant: this.props.participant.id,
        competitor: this.props.participant.competitor,
        event: this.props.participant.event,
        meet: this.props.participant.meet,
        division: this.props.participant.division,
        time: ''
      }
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

  addResult = event => {
    event.preventDefault();
    const { addEntity } = this.props;
    const { newResult } = this.state;
    if (
      newResult.time.toUpperCase() === 'DNF' ||
      newResult.time.toUpperCase() === 'DNS'
    ) {
      addEntity(RESULT, {
        ...newResult,
        time: DNF
      });
      this.setState(prevState => ({
        newResult: { ...prevState.newResult, time: '' }
      }));
    } else if (newResult.time.trim() !== '') {
      const colons = newResult.time.trim().match(/:/g);
      let duration;
      if (!colons) {
        duration = moment.duration('00:00:' + newResult.time);
      } else if (colons.length === 1) {
        duration = moment.duration('00:' + newResult.time);
      } else {
        duration = moment.duration(newResult.time);
      }
      if (duration.asMilliseconds() > 0) {
        addEntity(RESULT, {
          ...newResult,
          time: duration
        });
        this.setState(prevState => ({
          newResult: { ...prevState.newResult, time: '' }
        }));
      }
    }
  };

  render() {
    const { newResult } = this.state;
    return (
      <Form onSubmit={this.addResult} inline>
        <FormGroup>
          <FormControl
            type="text"
            value={newResult.time}
            name="time"
            data-object="newResult"
            placeholder="00:00.00"
            onChange={this.handleChange}
            autoComplete="off"
            inputMode="numeric"
          />
        </FormGroup>
      </Form>
    );
  }
}

export default AddResultForm;
