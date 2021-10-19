import React from "react"
import {Button, Card, Col, Container, Form, OverlayTrigger, Row, Table, Tooltip,} from "react-bootstrap"
import {useSelector} from "react-redux"
import ChannelRow from "../components/Channels/channelRow"
import {selectConfig} from "../features/device/deviceSlice"

function Channels() {
  const config = useSelector(selectConfig)

  function renderRow(){
    if(!config){
      return ""
    }
    let rows = []
    for(let i=0; i<config.channels; i++){
      rows.push(
        <ChannelRow
          show={config.show.indexOf(i) !== -1}
          record={config.record.indexOf(i) !== -1}
          channel={i}
          key={`Channels-${i}`}
        />
      )
    }
    return rows
  }

  return (
    <>
      <Container fluid>
        <Card>

        </Card>
      </Container>
    </>
  )
}

export default Channels
