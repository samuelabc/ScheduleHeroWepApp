import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap';
import { TextField } from '@material-ui/core';


const RegisterForm = (props) => {
    const handleRegister = props.handleRegister;
    const alertSettings = props.alertSettings
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const history = useHistory()

    async function checkError() {
        if (username.length < 8 || username.length > 30) {
            alertSettings.setAlertTitle('Registration failed')
            alertSettings.setAlertDescription('Wrong username format.')
            alertSettings.alertRef.current.changeVisibility()
            return 1;
        }
        for (let i = 0; i < username.length; i++) {
            if (!((username[i] >= '0' && username[i] <= '9') ||
                (username[i] >= 'a' && username[i] <= 'z') ||
                (username[i] >= 'A' && username[i] <= 'Z'))) {
                alertSettings.setAlertTitle('Registration failed')
                alertSettings.setAlertDescription('Wrong username format.')
                alertSettings.alertRef.current.changeVisibility();
                return 1;
            }
        }
        console.log(password)
        if (password.length < 8 || password.length > 30) {
            alertSettings.setAlertTitle('Registration failed')
            alertSettings.setAlertDescription('Wrong password format.')
            alertSettings.alertRef.current.changeVisibility()
            return 3;
        }
        for (let i = 0; i < password.length; i++) {
            if (password[i] < '!' || password[i] > '~') {
                alertSettings.setAlertTitle('Registration failed')
                alertSettings.setAlertDescription('Wrong password format.')
                alertSettings.alertRef.current.changeVisibility()
                return 3;
            }
        }

        if (password !== confirmPassword) {
            alertSettings.setAlertTitle('Registration failed')
            alertSettings.setAlertDescription('Value of password and confirm password should be the same.')
            alertSettings.alertRef.current.changeVisibility()
            return 4;
        }
        return 0;
    }

    const UserRegister = async (event) => {
        console.log('start register process');
        event.preventDefault();
        console.log(username, password, confirmPassword)
        var errcode = await checkError(alertSettings);
        if (errcode === 0) {
            const register_date = await new Date().getTime().toString();
            if (await handleRegister({ username, password, register_date }) === true) {
                setUsername('');
                setPassword('');
                setConfirmPassword('');
            }
            else {
                console.log('errcode', errcode)
                alertSettings.setAlertTitle('Registration failed')
                alertSettings.setAlertDescription('Username is taken.')
                alertSettings.alertRef.current.changeVisibility()
            }
        }
    }
    const handleJumpToLoginPage = (props) => {
        history.push('/login')
    }

    return (
        <Form onSubmit={UserRegister}>
            <Form.Group controlId="form-username">
                <Form.Label ><h4>Username</h4></Form.Label>
                <Form.Control type="text" size="lg"
                    placeholder="Enter username"
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                />
                <Form.Text>
                    Username should only contains alphabets and numbers,
                    with length between 8-30.
                </Form.Text>
            </Form.Group>
            <Form.Group controlId="form-password">
                <Form.Label><h4>Password</h4></Form.Label>
                <Form.Control type="password" size="lg"
                    placeholder="Enter password"
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                />
                <Form.Text>
                    Password should only contains alphabets, numbers and special characters of English,
                    with length between 8-30.
                </Form.Text>
            </Form.Group>
            <Form.Group controlId="form-confirmpassword">
                <Form.Label><h4>Confirm password</h4></Form.Label>
                <Form.Control type="password" size="lg"
                    placeholder="Enter confirm password"
                    value={confirmPassword}
                    onChange={({ target }) => setConfirmPassword(target.value)}
                />
            </Form.Group>
            <Button variant="success" type="submit"
                size="lg"
            >Register</Button>
            <Button className="light"
                variant="light" type="button"
                onClick={handleJumpToLoginPage}
                size="lg"  >
                Back to Login
            </Button>

        </Form >
    )
}
export default RegisterForm;