import React from "react"
import {Container} from "react-bootstrap"
import {useSelector} from "react-redux"
import {
  selectConfig,
} from "../features/device/deviceSlice"
import Recording from '../components/Channels/recording'

function Channels() {
  const config = useSelector(selectConfig)

  function getRules() {
    if(config !== undefined){
      return JSON.parse(config.rules)
    }
    return []
  }

  return (
    <Container fluid>
    {config !== undefined ? <Recording rules={getRules()} id={config.id} config={config}/> : ""}
    </Container>
  )
}

export default Channels
