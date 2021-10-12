import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {selectDevice, setDeviceAsync} from "../features/device/deviceSlice"
import {Alert, Button, Card, Col, Container, Form, Row} from "react-bootstrap"

function Device() {
  const device = useSelector(selectDevice)
  const dispatch = useDispatch()
  const [currentDevice, setDevice] = useState()

  useEffect(() => {
    console.log("11111", device)
    setDevice(device)
  }, [device])

  function handleChange(e) {
    setDevice({
      id: e.target.value
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log(e)
    dispatch(setDeviceAsync(e.target.device.value))
  }

  function showAlert() {
    if (currentDevice && currentDevice.ip === "n/a") {
      return <Alert key={"device-error"} variant={"danger"}>Wrong device ID, does not exist!</Alert>
    } else {
      return ""
    }

  }

  return (
    <Container fluid>
      <Row>
        <Col md={2}></Col>
        <Col md="8">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Choose device</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={e => handleSubmit(e)}>
                <Row>
                  <Col md={5}>
                    <label>Device ID</label>
                    <Form.Control
                      value={currentDevice ? currentDevice.id : "0"}
                      type="text"
                      name={"device"}
                      onChange={e => handleChange(e)}
                    />
                  </Col>
                  <Col md={5}>
                    <label>Device IP</label>
                    <Form.Control
                      value={currentDevice ? currentDevice.ip : ""}
                      type="text"
                      readOnly={true}
                      name={"ip"}
                    />
                  </Col>
                  <Col md={2} style={{position: "relative"}}>
                    <Button
                      className="btn-fill"
                      type="submit"
                      variant="primary"
                      style={{position: "absolute", bottom: "6px", left: "10%"}}
                    >
                      Set Device
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    {showAlert()}
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}></Col>
      </Row>
    </Container>
  )
}

export default Device
