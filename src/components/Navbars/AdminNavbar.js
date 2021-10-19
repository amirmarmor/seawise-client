import React from "react"
import {NavLink} from "react-router-dom"
import {Button, Container, Nav, Navbar} from "react-bootstrap"
import routes from "routes.js"

function Header() {
  const mobileSidebarToggle = (e) => {
    e.preventDefault()
    document.documentElement.classList.toggle("nav-open")
    var node = document.createElement("div")
    node.id = "bodyClick"
    node.onclick = function () {
      this.parentElement.removeChild(this)
      document.documentElement.classList.toggle("nav-open")
    }
    document.body.appendChild(node)
  }

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <div className="d-flex justify-content-center align-items-center ml-2 ml-lg-0">
          <Button
            variant="dark"
            className="d-lg-none btn-fill d-flex justify-content-center align-items-center rounded-circle p-2"
            onClick={mobileSidebarToggle}
          >
            <i className="fas fa-ellipsis-v"></i>
          </Button>
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="mr-2">
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="nav mr-auto" navbar>
            {routes.map(route =>
              <NavLink
                to={route.layout + route.path}
                className="nav-link"
                key={route.name}
              >
                <i className={route.icon}/>
                <p>{route.name}</p>
              </NavLink>
            )}
          </Nav>
          <Nav className="ml-auto" navbar>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
