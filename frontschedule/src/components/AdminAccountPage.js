import React, { useEffect, useState } from 'react'
import AdminNavigationBar from './AdminNavigationBar'
import userService from '../services/users'
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew'
import { Button } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';

const AdminAccountPage = (props) => {
    const username = props.username
    const userType = props.userType
    const setUsername = props.setUsername
    const setUserType = props.setUserType
    const history = useHistory()

    const handleLogout = async () => {
        setUsername('')
        setUserType('')
        console.log('handle logout')
        history.push('/login')
    }

    return (
        <div>
            <AdminNavigationBar />
            <h2 style={{ color: "red" }}>Admin Panel</h2>
            <h5 style={{ paddingTop: "2%" }}>
                username
                <b style={{ position: "absolute", left: "30%" }} > {username}</b>
            </h5>
            <h5>user type
                 <b style={{ position: "absolute", left: "30%" }}>{userType}</b>
            </h5>
            <Button size="lg" variant="danger" style={{ marginTop: "6%" }}
                onClick={handleLogout}><PowerSettingsNew /> Log out</Button>
        </div>
    )
}
export default AdminAccountPage