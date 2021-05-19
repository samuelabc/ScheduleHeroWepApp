import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Button, Form } from 'react-bootstrap';
import { TextField } from '@material-ui/core';

const DeleteAccountForm = (props) => {
    const handleDeleteAccount = props.handleDeleteAccount;
    const alertSettings = props.alertSettings
    const [password, setPassword] = useState('');
    const history = useHistory()
    async function checkError() {
        if (password.length < 8 || password.length > 30) {
            alertSettings.setAlertTitle('Delete account failed')
            alertSettings.setAlertDescription('Wrong password.')
            alertSettings.alertRef.current.changeVisibility()
            return 1;
        }
        for (let i = 0; i < password.length; i++) {
            if (password[i] < '!' || password[i] > '~') {
                alertSettings.setAlertTitle('Delete account failed')
                alertSettings.setAlertDescription('Wrong password.')
                alertSettings.alertRef.current.changeVisibility()
                return 1;
            }
        }
        return 0;
    }

    const DeleteAccount = async (event) => {
        event.preventDefault();
        var errcode = await checkError();
        if (errcode === 0) {
            console.log('errcode', errcode)
            const username = window.localStorage.username
            if (await handleDeleteAccount({ username, password }) === true) {
                setPassword('');
                history.push('/login')
            }
            else {
                alertSettings.setAlertTitle('Delete account failed')
                alertSettings.setAlertDescription('Wrong password.')
                alertSettings.alertRef.current.changeVisibility()
            }
        }
    }

    return (
        <Form onSubmit={DeleteAccount} >
            <Form.Group controlId="form-password">
                <Form.Label><h4>Password</h4></Form.Label>
                <Form.Control type="password" size="lg"
                    placeholder="Enter password"
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                />
            </Form.Group>
            <Button size="lg" type="submit"
                variant="danger">
                Delete this account
                </Button>
        </Form>
    )
}
export default DeleteAccountForm;