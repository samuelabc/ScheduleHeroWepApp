import React from 'react'
import userService from '../services/users'
import scheduleService from '../services/schedules'
import DeleteAccountForm from './DeleteAccountForm'
import NavigationBar from './NavigationBar'
import { Link, useHistory } from 'react-router-dom'
import { Button } from 'react-bootstrap';

const DeleteAccountPage = (props) => {
    const history = useHistory()
    const setUsername = props.setUsername
    const setUserType = props.setUserType
    const alertSettings = props.alertSettings
    const handleDeleteAccount = async (tupleObj) => {
        try {
            console.log('handledeleteaccount in delete account page', tupleObj)
            const username_to_delete = tupleObj.username
            console.log('username_to_delete', username_to_delete)
            var retObj;

            //delete account
            retObj = await userService.deleteaccount(tupleObj);
            console.log('delete user success', retObj);

            //delete schedules of the user
            retObj = await scheduleService.deleteSchedule(tupleObj)
            console.log('delete schedules success', retObj)

            setUsername('')
            setUserType('')
            return true;
        }
        catch (err) {
            console.log('delete failed', retObj);
            return false;
        }
    }
    return (
        <div >
            <NavigationBar />
            <h1>Delete Account</h1>
            <p>After deleting your account, all of the datas belong to your account will be deleted and are not recoverable.</p>
            <p>If you really wish to delete your account, please enter your password and clicked on the confirm button.</p>
            <div>
                <DeleteAccountForm
                    handleDeleteAccount={handleDeleteAccount}
                    alertSettings={alertSettings} />
            </div>
            <Link to='/useraccount'>
                <Button size="lg" variant="light" type="button" >Cancel</Button>
            </Link>
        </div>
    )
}
export default DeleteAccountPage;