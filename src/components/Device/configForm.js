import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {selectDevice} from "../../features/device/deviceSlice"
import {Button, Card, Col, Container, Form, Row, Alert} from "react-bootstrap"
import RuleRow from "./rules"

function ConfigForm(props) {
  const [currentConfig, setConfig] = useState()

  useEffect(() => {
    setConfig(props.config)
  }, [props.config])

  function addRule() {
    let rules = JSON.parse(currentConfig.rules)
    let rule = {
      id: rules.length + 1,
      recurring: 'Hour',
      start: 0,
      duration: 0
    }
    rules.push(rule)
    let rulesString = JSON.stringify(rules)
    setConfig({
      ...currentConfig,
      rules: rulesString
    })
  }

  function removeRule(e, ind) {
    let rules = JSON.parse(currentConfig.rules)
    rules.splice(ind, 1)
    let rulesString = JSON.stringify(rules)
    setConfig({
      ...currentConfig,
      rules: rulesString
    })
  }

  function handleRuleChange(e, id) {
    let rules = JSON.parse(currentConfig.rules)
    rules[id] = {
      ...rules[id],
      [e.target.name]: e.target.value
    }
    let rulesString = JSON.stringify(rules)
    setConfig({
      ...currentConfig,
      rules: rulesString
    })
  }

  function handleChange(e) {
    console.log(currentConfig, e)
    let value = e.target.value
    if (e.target.name === "cleanup") {
      value = e.target.checked.toString()
    }

    setConfig({
      ...currentConfig,
      [e.target.name]: value
    })
  }

  function renderRules() {
    console.log("*******", currentConfig.rules)
    let rules = JSON.parse(currentConfig.rules)
    return rules.map((rule, i) =>
      <RuleRow
        rule={rule}
        handleRuleChange={handleRuleChange}
        removeRule={removeRule}
        id={i}
        key={`rule-row-${i}`}
      />
    )
  }

  function renderForm() {
    console.log(props)
    if (props.current) {
      return <Form onSubmit={(e) => props.handleSubmit(e, currentConfig)}>
        <Row>
          <Col className="px-1" md="4">
            <Form.Group>
              <label>Offset</label>
              <Form.Control
                value={currentConfig.offset}
                placeholder="Offset"
                type="text"
                name={"offset"}
                onChange={e => handleChange(e)}
              />
            </Form.Group>
          </Col>
          <Col className="px-1" md="4">
            <Form.Group>
              <label>FPS</label>
              <Form.Control
                value={currentConfig.fps}
                placeholder="FPS"
                type="text"
                name={"fps"}
                onChange={e => handleChange(e)}
              />
            </Form.Group>
          </Col>
          <Col className="px-1" md="4">
            <label>Clean up</label>
            < br/>
            <input
              name={"cleanup"}
              id={"cleanup"}
              type={"checkbox"}
              checked={currentConfig.cleanup}
              onChange={e => handleChange(e)}
            />
          </Col>
        </Row>
        <Row>
          <Card.Header>Rules</Card.Header>
        </Row>
        {renderRules()}
        <Button
          className={"btn-fill pull-right"}
          style={{marginRight: "10px"}}
          onClick={addRule}
        > + </Button>
        <Button
          className="btn-fill pull-right"
          type="submit"
          variant="info"
        >
          Update Configuration
        </Button>
        <div className="clearfix"/>
      </Form>
    } else {
      return <Alert variant={"danger"}>
        Please select device first!
      </Alert>
    }
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title as="h4">Edit Configuration</Card.Title>
      </Card.Header>
      <Card.Body>
        {renderForm()}
      </Card.Body>
    </Card>
  )
}

export default ConfigForm
