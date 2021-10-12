import Config from "views/Configuration"
import Channels from "views/Channels"
import Device from "views/Device"

const dashboardRoutes = [
  {
    path: "/device",
    name: "Device",
    icon: "nc-icon nc-circle-09",
    component: Device,
    layout: "/admin"
  },
  {
    path: "/channels",
    name: "Video",
    icon: "nc-icon nc-circle-09",
    component: Channels,
    layout: "/admin"
  },
  {
    path: "/config",
    name: "Configuration",
    icon: "nc-icon nc-circle-09",
    component: Config,
    layout: "/admin"
  }
]

export default dashboardRoutes
