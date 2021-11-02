import React, {useState} from "react"
import {Alert, Card} from "react-bootstrap"
import Frame from "./frame"
import {useSelector, useDispatch} from "react-redux"
import {
  selectRealtime,
  setConfigAsync,
} from "../../features/device/deviceSlice"

function Recording(props) {
  const realtime = useSelector(selectRealtime)
  const dispatch = useDispatch()
  const [connType, setConnType] = useState(true)

  let recordingColor
  let recordingMsg

  function isRule() {
    let now = new Date()
    let hour = now.getHours()
    let minutes = now.getMinutes()
    let seconds = now.getSeconds()

    return props.rules.some(rule => {
      if (rule.type === "video") {
        if (rule.recurring >= "Hour" && hour === rule.start) {
          let elapsed = (hour - rule.start) * (60 * 60) + minutes * 60 + seconds
          if (elapsed < rule.duration) {
            return true
          }
        }

        if (rule.recurring === "Minute" && minutes >= rule.start) {
          let elapsed = (minutes - rule.start) * 60 + seconds
          if (elapsed < rule.duration) {
            return true
          }
        }

        if (rule.recurring === "Second" && seconds >= rule.start) {
          let elapsed = seconds - rule.start
          if (elapsed < rule.duration) {
            return true
          }
        }
      }
      return false
    })
  }

  function setRecording(){
    if(realtime && realtime.r){
      recordingColor = "red"
      recordingMsg = "RECORDING "
    } else if(isRule()){
      recordingColor = "grey"
      recordingMsg = "RECORDING BY SCHEDULED TASK "
    } else {
      recordingColor = "black"
      recordingMsg = "PRESS TO START RECORDING "
    }
  }

  function renderFrames() {
    let frames = []
    for (let i = 0; i < realtime.channels; i++) {
      frames.push(
        <Frame
          key={`Channels-${i}`}
          channel={i}
          ip={connType ? realtime.local : realtime.external}
          recording={recordingColor}
        />
      )
    }
    return frames
  }

  function handleClick(){
    let body = {...props.config}
    if(recordingColor === 'black'){
      body.record = true
    } else if(recordingColor === 'red'){
      body.record = false
    }
    dispatch(setConfigAsync(body, props.id))
  }

  setRecording()

  const styleMain = {
    width: "100%",
    height: "100%",
    textAlign: "center",
    position: "relative",
  }

  const recordingStyle = {
    position: "absolute",
    right: "10px",
    top: "10px"
  }

  const recordCircleOuter = {
    width: "20px",
    height: "20px",
    borderRadius: "50px",
    border: `3px solid ${recordingColor}`,
    position: "relative",
    display: "inline-block",
    verticalAlign: "middle",
    top: "-2px",
    color: recordingColor,
    cursor: recordingColor === 'black' || recordingColor === 'red' ? "pointer" :  "default"
  }

  const recordCircleInner = {
    width: "10px",
    height: "10px",
    borderRadius: "50px",
    backgroundColor: recordingColor,
    position: "absolute",
    left: "2px",
    top: "2px",
    verticalAlign: "middle"
  }
  return (
    <>
      <Card>
        <Card.Header>
          Choose Local Connection (unchecked means external connection)
        </Card.Header>
        <Card.Body>
          <input
            type={"checkbox"}
            checked={connType}
            onChange={()=>setConnType(!connType)}
          />
        </Card.Body>
      </Card>
      {realtime !== undefined ?
        <Card>
          <Card.Header>
            STREAMS
            <div style={recordingStyle}>
              <span>{recordingMsg}</span>
              <div style={recordCircleOuter} onClick={()=>handleClick()}>
                <div style={recordCircleInner}/>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <div style={styleMain}>
              {renderFrames()}
            </div>
          </Card.Body>
        </Card> : <Alert variant={"danger"}>
          Please select device first!
        </Alert>
      }
    </>
  )
}

export default Recording