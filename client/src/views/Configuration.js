import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {
  selectCurrent,
  selectConfig,
  selectUpdated,
  setConfigAsync,
  selectRealtime,
  configUpdated
} from "../features/device/deviceSlice"
import {Alert, Card, CardGroup, Col, Container, ListGroup, ListGroupItem, Row} from "react-bootstrap"
import Instructions from "../components/Configuration/instructions"
import ConfigForm from "../components/Configuration/configForm"
import CardHeader from "react-bootstrap/CardHeader"

function Configuration() {
  const current = useSelector(selectCurrent)
  const config = useSelector(selectConfig)
  const updated = useSelector(selectUpdated)
  const device = useSelector(selectRealtime)
  const dispatch = useDispatch()

  function handleSubmit(e, config) {
    e.preventDefault()
    dispatch(setConfigAsync(config, current))
  }

  function renderDeviceDetails() {
    if (device !== undefined) {
      return <Card>
        <ListGroup>
          <ListGroupItem>
            Device ID - {current}
          </ListGroupItem>
          <ListGroupItem>
            Local IP - {device.local}
          </ListGroupItem>
          <ListGroupItem>
            External IP - {device.external}
          </ListGroupItem>
        </ListGroup>
      </Card>
    }
  }

  function renderConfiguration() {
    if (!config) {
      return <ConfigForm/>
    } else {
      return <ConfigForm
        current={current}
        config={config}
        handleSubmit={handleSubmit}
      />
    }
  }

  return (
    <Container fluid>
      <Row>
        <Col md="8">
          <Row>
            {renderDeviceDetails()}
          </Row>
          <Row>
            {renderConfiguration()}
          </Row>
          <Row>
            {updated ? <Alert
              variant={'success'}
              onClose={() => dispatch(configUpdated(false))}
              dismissible={true}
              style={{padding: "15px", color: "green"}}
            >
              Configuration Successfully updated
            </Alert> : ''
            }
          </Row>
        </Col>
        <Col md="4">
          <Instructions/>
        </Col>
      </Row>
    </Container>
  )
}

export default Configuration
