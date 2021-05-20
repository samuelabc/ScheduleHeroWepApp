import React, { useEffect, useRef, useState } from 'react';
import Togglable from './Togglable';
import NavigationBar from './NavigationBar'
import Service from '../services/users';
import ChangePasswordForm from './ChangePasswordForm';
import { useHistory, Link } from 'react-router-dom';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew'
// import { Button } from '@material-ui/core';
import { Button } from 'react-bootstrap';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'

const UserAccountPage = (props) => {
    const setUsername = props.setUsername
    const setUserType = props.setUserType
    const setSchedules = props.setSchedules
    const username = props.username
    const userType = props.userType
    const registerDate = props.registerDate
    const alertSettings = props.alertSettings
    const togglableRef = useRef();
    const history = useHistory()

    const handleChangePassword = async (tupleObj) => {
        try {
            var retObj = await Service.changepassword(tupleObj);
            console.log('password changed');
            console.log('handlechangedpassword username', username)
            console.log('handlechangedpassword userType', userType)
            setUsername('')
            setUserType('')
            return true;
        }
        catch (err) {
            console.log('change password failed');
            return false;
        }
    }
    const handleLogout = async () => {
        await setUsername('')
        await setUserType('')
        await setSchedules([])
        console.log('handle logout')
        history.push('/login')
    }
    const handleJumpToDeleteAccountPage = () => {
        history.push('/deleteaccount')
    }
    return (
        <div>
            <NavigationBar />
            <h1>Account Management</h1>
            <h5 style={{ paddingTop: "2%" }}>
                username
                <b style={{ position: "absolute", left: "30%" }} > {username}</b>
            </h5>
            <h5>user type
                 <b style={{ position: "absolute", left: "30%" }}>{userType}</b>
            </h5>
            <h5>register date
                 <b style={{ position: "absolute", left: "30%" }}>{new Date(parseInt(registerDate)).toLocaleDateString()}</b>
            </h5>
            <div style={{ paddingBottom: "7%" }}></div >
            <Button variant="danger" size="lg"
                onClick={handleLogout}><PowerSettingsNew /> Log out</Button>
            <Togglable ref={togglableRef} buttonLabel='Change password' type='changepasswordform'>
                <ChangePasswordForm
                    handleChangePassword={handleChangePassword}
                    togglableRef={togglableRef}
                    alertSettings={alertSettings} />
            </Togglable>
            <Button variant="light" size="lg"
                onClick={handleJumpToDeleteAccountPage}>
                Delete account
            </Button>
        </div>
    )
}
export default UserAccountPage;