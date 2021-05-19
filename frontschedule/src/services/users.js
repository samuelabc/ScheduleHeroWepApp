import axios from 'axios'
const baseUrl = '/users'

async function getToken() {
    var token = `bearer ` + window.localStorage.getItem('token')
    return token
}
const getallusers = async (tupleObj) => {
    const token = await getToken()
    console.log('getschedule gettoken', token)
    const config = {
        headers: { Authorization: token },
        data: tupleObj
    }
    console.log('users service getallusers', config)
    const response = await axios.get(`${baseUrl}`, config);
    console.log('users service getallusers response', response)
    return response.data
}
const login = async (tupleObj) => {
    console.log('users service login', tupleObj)
    const response = await axios.post(`${baseUrl}/login`, tupleObj);
    console.log('users service login response', response)
    return response.data
}
const register = async (tupleObj) => {
    console.log('users service register', tupleObj)
    const response = await axios.post(`${baseUrl}/register`, tupleObj);
    console.log('users service register response', response)
    return response.data
}
const changepassword = async (tupleObj) => {
    const token = await getToken()
    console.log('getschedule gettoken', token)
    const config = {
        headers: { Authorization: token },
    }
    const response = await axios.put(`${baseUrl}/changepassword`, tupleObj, config);
    return response.data
}

const deleteaccount = async (tupleObj) => {
    const token = await getToken()
    console.log('getschedule gettoken', token)
    const config = {
        headers: { Authorization: token },
        data: tupleObj
    }
    console.log('users service deleteaccount', tupleObj)
    const response = await axios.delete(baseUrl, config);
    console.log('users service deleteaccount response', response)
    return response.data
}
export default {
    login,
    register,
    changepassword,
    deleteaccount,
    getallusers,
    // setToken
}