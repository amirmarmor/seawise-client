import React, {useEffect, useRef} from "react"
import {Alert, Card} from "react-bootstrap"
import Frame from "./frame"
import {useSelector, useDispatch} from "react-redux"
import {
  getRealtimeAsync,
  selectRealtime,
  setConfigAsync,
} from "../../features/device/deviceSlice"

function Recording(props) {
  const realtime = useSelector(selectRealtime)
  const dispatch = useDispatch()
  const init = useRef({id: props.id, interval: 0})
  let recordingColor
  let recordingMsg

  useEffect(() => {
    return () => {
      clearInterval(init.current.interval)
    }
  }, [])

  function refresh() {
    if (!init.current.interval) {
      init.current.interval = setInterval(() => {
        if (props.id) {
          dispatch(getRealtimeAsync(props.id))
        }
      }, 1000)
    } else if (init.current.id !== props.id) {
      clearInterval(init.current.interval)
      init.current = {id: props.id, interval: null}
      refresh()
    }
  }


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
          ip={realtime.ip}
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

  refresh()
  setRecording()

  const styleMain = {
    width: "100%",
    height: "100%",
    textAlign: "center",
    position: "relative",
    border: "3px solid purple"
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