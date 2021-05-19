import React from 'react'
import { Redirect, Route, Link, useHistory } from 'react-router-dom';
import userService from '../services/users'
import scheduleService from '../services/schedules'

import LoginForm from './LoginForm'
import { Button } from 'react-bootstrap';

const LoginPage = (props) => {
    const setUsername = props.setUsername
    const setUserType = props.setUserType
    const setRegisterDate = props.setRegisterDate
    const setToken = props.setToken
    const alertSettings = props.alertSettings
    const history = useHistory()

    const handleLogin = async (tupleObj) => {
        console.log('handlelogin in login page', tupleObj)
        try {
            var retObj = await userService.login(tupleObj);
            console.log('login retobj', retObj)
            var username = retObj.data.username;
            var userType = retObj.data.user_type;
            var registerDate = retObj.data.register_date;
            var token = retObj.data.token
            console.log('login retObj', retObj.data)
            await setToken(token)
            await setUserType(userType)
            await setRegisterDate(registerDate)
            await setUsername(username)
            console.log('login success');
            return true;
        }
        catch (err) {
            console.log('error', err)
            console.log('login failed')
            return false;
        }
    }
    const handleJumpToRegisterPage = (props) => {
        history.push('/register')
    }
    return (
        <div >
            <h1>
                Welcome to
                <span style={{ color: "LightSeaGreen" }}> ScheduleHero</span>
                , please log in.
            </h1>
            <div>
                <LoginForm handleLogin={handleLogin}
                    alertSettings={alertSettings} />
            </div>

            <h2 >Don't have an account?</h2>
            <Button className="button"
                size="lg"
                variant="primary" onClick={handleJumpToRegisterPage}
            >Register here</Button>
        </div>
    )
}
export default LoginPage;