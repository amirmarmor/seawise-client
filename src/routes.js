// import Config from "views/configuration"
import Channels from "views/Channels"
import Devices from "views/Devices"

const dashboardRoutes = [
  {
    path: "/channels",
    name: "Video",
    icon: "nc-icon nc-circle-09",
    component: Channels,
    layout: "/admin"
  },
  {
    path: "/devices",
    name: "Configuration",
    icon: "nc-icon nc-circle-09",
    component: Devices,
    layout: "/admin"
  }
]

export default dashboardRoutes
