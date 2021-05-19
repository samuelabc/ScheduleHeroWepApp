import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Nav, Navbar } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ListAltIcon from '@material-ui/icons/ListAlt';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
const AdminNavigationBar = (props) => {
    const history = useHistory()
    return (
        <Navbar bg="light" variant="light" >
            <Navbar.Brand><h2 style={{ color: "LightSeaGreen" }}>Schedule Hero</h2></Navbar.Brand >
            <Nav variant="tabs" defaultActiveKey="/home"  >
                <Nav.Item>
                    <LinkContainer to="/adminaccount">
                        <Nav.Link>
                            <AccountCircleIcon /> User Account
                        </Nav.Link>
                    </LinkContainer>
                </Nav.Item>
                <Nav.Item>
                    <LinkContainer to="/adminusermanagement">
                        <Nav.Link><ListAltIcon /> User Management</Nav.Link>
                    </LinkContainer>
                </Nav.Item>
                {/* <Nav.Item>
                    <LinkContainer to="/statistics">
                        <Nav.Link><DonutLargeIcon /> Statistics</Nav.Link>
                    </LinkContainer>
                </Nav.Item> */}
            </Nav>
        </Navbar>
    )
}
export default AdminNavigationBar