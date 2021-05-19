import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Button, Form } from 'react-bootstrap';
import { TextField } from '@material-ui/core';

const LoginForm = (props) => {
    const handleLogin = props.handleLogin
    const alertSettings = props.alertSettings
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory()
    async function checkError() {
        if (username.length < 8 || username.length > 30) {
            alertSettings.setAlertTitle('Login failed')
            alertSettings.setAlertDescription('Wrong username or password.')
            alertSettings.alertRef.current.changeVisibility()
            return 1;
        }
        for (let i = 0; i < username.length; i++) {
            if (!((username[i] >= '0' && username[i] <= '9') ||
                (username[i] >= 'a' && username[i] <= 'z') ||
                (username[i] >= 'A' && username[i] <= 'Z'))) {
                alertSettings.setAlertTitle('Login failed')
                alertSettings.setAlertDescription('Wrong username or password.')
                alertSettings.alertRef.current.changeVisibility()
                return 1;
            }
        }
        if (password.length < 8 || password.length > 30) {
            alertSettings.setAlertTitle('Login failed')
            alertSettings.setAlertDescription('Wrong username or password.')
            alertSettings.alertRef.current.changeVisibility()
            return 1;
        }
        for (let i = 0; i < password.length; i++) {
            if (password[i] < '!' || password[i] > '~') {
                alertSettings.setAlertTitle('Login failed')
                alertSettings.setAlertDescription('Wrong username or password.')
                alertSettings.alertRef.current.changeVisibility()
                return 1;
            }
        }
        return 0;
    }

    const UserLogin = async (event) => {
        event.preventDefault();
        var errcode = await checkError();
        console.log('errcode', errcode)
        if (errcode === 0) {
            var returnedValue = await handleLogin({ username, password });
            console.log('returned value in login form', returnedValue)
            if (returnedValue === true) {
                // setUsername('');
                // setPassword('');
                console.log('redirecting to schedule page')
                history.push('/schedules')
            }
            else if (returnedValue === false) {
                alertSettings.setAlertTitle('Login failed')
                alertSettings.setAlertDescription('Wrong username or password.')
                alertSettings.alertRef.current.changeVisibility()
            }
        }
    }

    return (
        <Form onSubmit={UserLogin}>
            <Form.Group controlId="form-username">
                <Form.Label ><h4>Username</h4></Form.Label>
                <Form.Control type="text" size="lg"
                    placeholder="Enter username"
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                />
            </Form.Group>
            <Form.Group controlId="form-password">
                <Form.Label><h4>Password</h4></Form.Label>
                <Form.Control type="password" size="lg"
                    placeholder="Enter password"
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                />
            </Form.Group>
            <Button className="button"
                type="submit" variant="success"
                size="lg">Log in</Button>
        </Form >
    )
}
export default LoginForm;