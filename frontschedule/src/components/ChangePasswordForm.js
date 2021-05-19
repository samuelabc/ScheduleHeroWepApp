import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Button, Form } from 'react-bootstrap';
import { TextField } from '@material-ui/core';

const ChangePasswordForm = (props) => {
    const handleChangePassword = props.handleChangePassword;
    const togglableRef = props.togglableRef
    const alertSettings = props.alertSettings
    const [oldpassword, setOldpassword] = useState('')
    const [newpassword, setNewpassword] = useState('')
    const [confirmNewpassword, setConfirmNewpassword] = useState('')
    const history = useHistory()

    async function checkError() {
        if (oldpassword.length < 8 || oldpassword.length > 30) {
            alertSettings.setAlertTitle('Change password failed')
            alertSettings.setAlertDescription('Wrong old password.')
            alertSettings.alertRef.current.changeVisibility()
            return 1;
        }
        for (let i = 0; i < oldpassword.length; i++) {
            if (oldpassword[i] < '!' || oldpassword[i] > '~') {
                alertSettings.setAlertTitle('Change password failed')
                alertSettings.setAlertDescription('Wrong old password.')
                alertSettings.alertRef.current.changeVisibility()
                return 1;
            }
        }
        if (newpassword.length < 8 || newpassword.length > 30) {
            alertSettings.setAlertTitle('Change password failed')
            alertSettings.setAlertDescription('Wrong new password format.')
            alertSettings.alertRef.current.changeVisibility()
            return 2;
        }
        for (let i = 0; i < newpassword.length; i++) {
            if (newpassword[i] < '!' || newpassword[i] > '~') {
                alertSettings.setAlertTitle('Change password failed')
                alertSettings.setAlertDescription('Wrong new password format.')
                alertSettings.alertRef.current.changeVisibility()
                return 2;
            }
        }
        if (newpassword !== confirmNewpassword) {
            alertSettings.setAlertTitle('Change password failed')
            alertSettings.setAlertDescription('Value of new password and confirm new password should be the same.')
            alertSettings.alertRef.current.changeVisibility()
            return 3;
        }
        return 0;
    }
    const changePassword = async (event) => {
        event.preventDefault();
        var errcode = await checkError();
        if (errcode === 0) {
            let username = window.localStorage.getItem('username')
            if (await handleChangePassword({ username, oldpassword, newpassword })) {
                setOldpassword('');
                setNewpassword('');
                setConfirmNewpassword('');
                console.log('changepassword in changepasswordform history push login')
                history.push('/login')
            }
            else {
                alertSettings.setAlertTitle('Change password failed')
                alertSettings.setAlertDescription('Wrong old password.')
                alertSettings.alertRef.current.changeVisibility()
            }
        }
    }

    return (
        <Form onSubmit={changePassword}>
            <Form.Group controlId="form-oldpassword">
                <Form.Label ><h4>Old password</h4></Form.Label>
                <Form.Control type="password" size="lg"
                    placeholder="Enter old password"
                    value={oldpassword}
                    onChange={({ target }) => setOldpassword(target.value)}
                />
            </Form.Group>
            <Form.Group controlId="form-newpassword">
                <Form.Label ><h4>New password</h4></Form.Label>
                <Form.Control type="password" size="lg"
                    placeholder="Enter new password"
                    value={newpassword}
                    onChange={({ target }) => setNewpassword(target.value)}
                />
                <Form.Text>
                    Password should only contains alphabets, numbers and special characters in English, with length between 8-30.
                </Form.Text>
            </Form.Group>
            <Form.Group controlId="form-confirmnewpassword">
                <Form.Label ><h4>Confirm new password</h4></Form.Label>
                <Form.Control type="password" size="lg"
                    placeholder="Enter new password"
                    value={confirmNewpassword}
                    onChange={({ target }) => setConfirmNewpassword(target.value)}
                />
            </Form.Group>
            <Button type="submit" size="lg"
                variant="success" >Change password</Button>
            <Button
                type="button" size="lg"
                variant="light"
                onClick={() => togglableRef.current.toggleVisibility()} >
                Cancel
                </Button>
        </Form>
    )
}
export default ChangePasswordForm;