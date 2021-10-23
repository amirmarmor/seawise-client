// import Config from "views/configuration"
import Channels from "views/Channels"
import Configuration from "views/Configuration"

const dashboardRoutes = [
  {
    path: "/channels",
    name: "Video",
    icon: "nc-icon nc-circle-09",
    component: Channels,
    layout: "/admin"
  },
  {
    path: "/configuration",
    name: "Configuration",
    icon: "nc-icon nc-circle-09",
    component: Configuration,
    layout: "/admin"
  }
]

export default dashboardRoutes
