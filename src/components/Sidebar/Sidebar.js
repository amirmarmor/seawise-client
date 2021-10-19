import React from "react"
import {Nav} from "react-bootstrap"
import {useDispatch, useSelector} from "react-redux"
import {
  getConfigAsync,
  selectDevices,
  selectCurrent
} from "../../features/device/deviceSlice"

function Sidebar({color, image, routes}) {
  const devices = useSelector(selectDevices)
  const current = useSelector(selectCurrent)
  const dispatch = useDispatch()

  function handleClick(id) {
    dispatch(getConfigAsync(id))
  }

  function renderDevices() {
    if (devices !== undefined) {
      return devices.map((device, key) =>
        <li
          className={
            device.id === current ? "active" : ""
          }
          key={`device-${key}`}
          onClick={() => handleClick(device.id)}
        >
          <p className="nav-link"
             style={{cursor: "pointer"}}
          >Device - {device.id} ({device.ip})</p>
        </li>
      )
    }
    return ""
  }

  return (
    <div className="sidebar" data-image={image} data-color={color}>
      <div
        className="sidebar-background"
        style={{
          backgroundImage: "url(" + image + ")"
        }}
      />
      <div className="sidebar-wrapper">
        <div className="logo d-flex align-items-center justify-content-start">
          <a
            href="https://www.creative-tim.com?ref=lbd-sidebar"
            className="simple-text logo-mini mx-1"
          >
            <div className="logo-img">
              <img
                src={require("../../assets/img/logo_transparent.png").default}
                alt="..."
              />
            </div>
          </a>
          <a className="simple-text" href="http://www.seawisely.com">
            SeaWise
          </a>
        </div>
        <Nav>
          {renderDevices()}
        </Nav>
      </div>
    </div>
  )
}

export default Sidebar