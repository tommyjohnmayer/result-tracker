import React, { Component } from "react";
import {
  Button,
  Glyphicon,
  Modal,
  Panel,
  Table
} from "react-bootstrap";

class RunOrderModal extends Component {
  swap = (a, b) => {
    const { editParticipant } = this.props;
    let temp = a.order;
    a.order = b.order;
    b.order = temp;
    editParticipant(a);
    editParticipant(b);
  };

  render() {
    const { show, hide, competitors, participants } = this.props;
    const sortedParticipants = participants.sort((a, b) => a.order - b.order);
    return (
      <Modal size="sm" show={show} onHide={() => hide(false)}>
        <Panel>
          <Panel.Heading>Set Run Order</Panel.Heading>
          <Panel.Body>
            <Table condensed>
              <tbody>
                {sortedParticipants.map((participant, index, array) => (
                  <tr key={participant.id}>
                    <td>{competitors[participant.competitor].name}</td>
                    <td>{participant.division}</td>
                    <td>
                      {index > 0 && (
                        <Button
                          bsStyle="link"
                          onClick={() =>
                            this.swap(participant, array[index - 1])
                          }
                        >
                          <Glyphicon glyph="chevron-up" />
                        </Button>
                      )}
                    </td>
                    <td>
                      {index < array.length - 1 && (
                        <Button
                          bsStyle="link"
                          onClick={() =>
                            this.swap(participant, array[index + 1])
                          }
                        >
                          <Glyphicon glyph="chevron-down" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button bsStyle="primary" onClick={() => hide(false)}>
              done
            </Button>
          </Panel.Body>
        </Panel>
      </Modal>
    );
  }
}

export default RunOrderModal;
