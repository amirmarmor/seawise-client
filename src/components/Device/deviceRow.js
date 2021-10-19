import {Row, Col, ListGroup, ListGroupItem} from "react-bootstrap"
import React from "react"

function DeviceRow(props) {
  console.log("11112", props)
  return (
    <Row>
      <ListGroup horizontal>
        <ListGroupItem>
          <input
            name={`devices`}
            type={"radio"}
            value={props.id}
            checked={props.current === props.id}
            onChange={(e) => props.handleChange(e)}
          />
        </ListGroupItem>
        <ListGroupItem>
          EDIT DEVICE ID - {props.id}
        </ListGroupItem>
        <ListGroup horizontal={true}>
          <ListGroupItem style={{width: "200px"}}>S/N: {props.device_serial_number}</ListGroupItem>
          <ListGroupItem style={{width: "200px"}}>IP: {props.ip}</ListGroupItem>
          <ListGroupItem style={{width: "200px"}}>channels: {props.channels}</ListGroupItem>
        </ListGroup>
      </ListGroup>
    </Row>
  )
}

export default DeviceRow