import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {
  selectDevices,
  selectCurrent,
  selectConfig,
  selectUpdated,
  getConfigAsync,
  setConfigAsync,
  configUpdated
} from "../features/device/deviceSlice"
import {Alert, Button, Card, Col, Container, Row} from "react-bootstrap"
import DeviceRow from "../components/Device/deviceRow"
import Instructions from "../components/Device/instructions"
import Configuration from "../components/Device/configuration"

function Devices() {
  const devices = useSelector(selectDevices)
  const current = useSelector(selectCurrent)
  const config = useSelector(selectConfig)
  const updated = useSelector(selectUpdated)
  const dispatch = useDispatch()

  function handleChange(id) {
    dispatch(getConfigAsync(id))
  }

  function handleSubmit(e, config) {
    e.preventDefault()
    // let rules = currentConfig.rules.map(rule => {
    //   return {
    //     ...rule,
    //     id: rule.id.toString(),
    //     start: rule.start.toString(),
    //     duration: rule.duration.toString()
    //   }
    // })
    console.log("submit", config)
    dispatch(setConfigAsync(config))
  }


  function renderDevices() {
    if (devices === undefined) {
      return <Alert variant={"Primary"}>
        Waiting to receive devices ID's
      </Alert>
    }

    return devices.map((device, i) => {
      return <DeviceRow id={device.id} checked={device.id === current} handleChange={handleChange} key={i}/>
    })
  }

  function renderConfiguration() {
    if (!config) {
      return <Configuration/>
    } else {
      return <Configuration
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
            <Card>
              <Card.Header>
                <Card.Title as="h4">Edit Configuration</Card.Title>
              </Card.Header>
              <Card.Body>
                {renderDevices()}
              </Card.Body>
            </Card>
          </Row>
          <Row>
            {renderConfiguration()}
          </Row>
          <Row>
            {updated ? <Alert
              variant={'success'}
              onClose={()=>dispatch(configUpdated(false))}
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

export default Devices
