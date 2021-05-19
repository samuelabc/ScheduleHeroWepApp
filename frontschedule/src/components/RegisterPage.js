import React from 'react'
import { useHistory } from 'react-router-dom';
import Service from '../services/users'
import Form from './RegisterForm'

const RegisterPage = (props) => {
    const alertSettings = props.alertSettings
    const history = useHistory()

    const handleRegister = async (tupleObj) => {
        console.log('handle register in register page', tupleObj)
        try {
            var retObj = await Service.register(tupleObj);
            console.log('register success', retObj);
            history.push('/login')
            return true;
        }
        catch (err) {
            console.log('register failed');
            return false;
        }
    }
    return (
        <div >
            <h1>Please register.</h1>
            <div>
                <Form handleRegister={handleRegister}
                    alertSettings={alertSettings} />
            </div>
        </div>
    )
}
export default RegisterPage;