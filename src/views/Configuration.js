import React, {useState} from "react"
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
import {Alert, Button, Card, Col, Container, ListGroup, Row} from "react-bootstrap"
import DeviceRow from "../components/Device/deviceRow"
import Instructions from "../components/Device/instructions"
import ConfigForm from "../components/Device/configForm"

function Configuration() {
  const devices = useSelector(selectDevices)
  const current = useSelector(selectCurrent)
  const config = useSelector(selectConfig)
  const updated = useSelector(selectUpdated)
  const dispatch = useDispatch()
  const [showConfig, setShowConfig] = useState()

  function handleChange(e) {
    dispatch(getConfigAsync(e.target.value, e.target.checked))
    setShowConfig(e.target.checked)
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

export default Configuration
