import {Row, Col, ListGroup, ListGroupItem} from "react-bootstrap"
import React from "react"

function DeviceRow(props) {
  return (
    <Row>
      <ListGroup horizontal>
          <ListGroupItem>
            <input
              name={`device-${props.id}`}
              type={"checkbox"}
              checked={props.checked}
              value={props.id}
              onChange={() => props.handleChange(props.id)}
            />
          </ListGroupItem>
          <ListGroupItem>
            EDIT DEVICE ID - {props.id}
          </ListGroupItem>
      </ListGroup>
    </Row>
  )
}

export default DeviceRow