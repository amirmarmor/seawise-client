import {Col,Row} from "react-bootstrap"
import React from "react"
import Frame from "./frame"

function ChannelRow(props) {
  return (
    <Row>
      <Col md={12}>
        <Frame
          show={props.show}
          record={props.record}
          channel={props.channel}
          key={`cahnnel-${props.channel}`}
        />
      </Col>
    </Row>
  )
}

export default ChannelRow