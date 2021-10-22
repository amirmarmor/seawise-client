import React from "react"
import {Container} from "react-bootstrap"
import {useSelector} from "react-redux"
import {
  selectConfig, selectCurrent
} from "../features/device/deviceSlice"
import Recording from '../components/Channels/recording'

function Channels() {
  const config = useSelector(selectConfig)
  const current = useSelector(selectCurrent)

  function getRules() {
    if(config !== undefined){
      return JSON.parse(config.rules)
    }
    return []
  }

  return (
    <Container fluid>
    {config !== undefined ? <Recording rules={getRules()} id={current} config={config}/> : ""}
    </Container>
  )
}

export default Channels
