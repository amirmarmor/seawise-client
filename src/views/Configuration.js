import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {
  selectCurrent,
  selectConfig,
  selectUpdated,
  setConfigAsync,
  configUpdated
} from "../features/device/deviceSlice"
import {Alert, Col, Container, Row} from "react-bootstrap"
import Instructions from "../components/Configuration/instructions"
import ConfigForm from "../components/Configuration/configForm"

function Configuration() {
  const current = useSelector(selectCurrent)
  const config = useSelector(selectConfig)
  const updated = useSelector(selectUpdated)
  const dispatch = useDispatch()

  function handleSubmit(e, config) {
    e.preventDefault()
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
