import React, { Component } from 'react';
import {
  Button,
  DropdownButton,
  FormControl,
  Glyphicon,
  MenuItem,
  Modal,
  Panel
} from 'react-bootstrap';
import { COMPETITOR } from '../App';

class Competitor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editCompetitorModalVisible: false,
      updateCompetitor: {}
    };
  }

  updateCompetitor = event => {
    event.preventDefault();
    const { editEntity } = this.props;
    const { updateCompetitor } = this.state;
    editEntity(COMPETITOR, updateCompetitor);
    this.showEditModal(false);
  };

  handleChange = event => {
    this.setState({
      [event.target.dataset.object]: {
        ...this.state[event.target.dataset.object],
        [event.target.name]: event.target.value
      }
    });
  };

  showEditModal = show => {
    this.setState({
      editCompetitorModalVisible: show,
      updateCompetitor: this.props.competitor
    });
  };

  render() {
    const { competitor, edit } = this.props;
    const { editCompetitorModalVisible, updateCompetitor } = this.state;
    document.title = 'Live Result Tracker';
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title>
            {competitor.name}
            {edit && (
              <DropdownButton
                bsStyle="link"
                id="meet-menu"
                noCaret
                title={<Glyphicon glyph="menu-hamburger" />}
              >
                <MenuItem
                  onSelect={() => this.showEditModal(true)}
                  eventKey="edit"
                >
                  edit
                </MenuItem>
              </DropdownButton>
            )}
          </Panel.Title>
        </Panel.Heading>
        <Modal
          show={editCompetitorModalVisible}
          onHide={() => this.showEditModal(false)}
        >
          <Panel>
            <Panel.Heading>{competitor.name}</Panel.Heading>
            <Panel.Body>
              <form onSubmit={this.updateCompetitor}>
                <FormControl
                  type="text"
                  value={updateCompetitor.name}
                  name="name"
                  placeholder="Enter Competitor Name"
                  onChange={this.handleChange}
                  data-object="updateCompetitor"
                  autoComplete="off"
                />
                <FormControl
                  type="text"
                  value={updateCompetitor.division}
                  name="division"
                  placeholder="Enter Division"
                  onChange={this.handleChange}
                  data-object="updateCompetitor"
                  autoComplete="off"
                />
                <Button bsStyle="primary" type="submit">
                  update competitor
                </Button>
              </form>
            </Panel.Body>
          </Panel>
        </Modal>
      </Panel>
    );
  }
}

export default Competitor;
