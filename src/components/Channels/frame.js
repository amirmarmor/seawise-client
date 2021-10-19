import React, {useState} from "react"
function Frame(props) {
  const [overlay, setOverlay] = useState()
  const src = `http://${props.ip}:8080/stream/${props.channel}`

  function handleClick(){
    window.open(src, '_blank').focus()
  }

  const frameStyle={
    width: "100%",
    height: "500px",
  }

  const overlayStyle = {
    display: overlay ? "block" : "none",
    position: "absolute",
    border: "1px solid blue",
    width: "10%",
    height: "50px",
    top: "0",
    left: "0",
    background: "rgba(255,255,255,0.5)"
  }

  const wrapperStyle = {
    display: "inline-block",
    position: "relative",
    border: "1px solid red",
    width: "49.9%",
  }

  return (
    <div
      style={wrapperStyle}
      onMouseEnter={()=>setOverlay(true)}
      onMouseLeave={()=>setOverlay(false)}
      onClick={()=>handleClick()}
    >
      <iframe title={`channel-${props.channel}`} src={`http://${props.ip}:8080/stream/${props.channel}`} style={frameStyle}/>
      <div style={overlayStyle}>Full Screen</div>
    </div>
  )
}

export default Frame