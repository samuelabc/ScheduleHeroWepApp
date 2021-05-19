import React, { useEffect, useState } from 'react'
import AdminNavigationBar from './AdminNavigationBar'
import userService from '../services/users'
import scheduleService from '../services/schedules'
import UsersTable from './UsersTable'
import {
    InputBase, TextField, Select, MenuItem, InputLabel, FormControl,
    makeStyles, Button, InputAdornment, Switch, FormControlLabel
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { Link, useHistory } from 'react-router-dom'

const AdminUserManagementPage = (props) => {
    const initialUsers = () => JSON.parse(window.localStorage.getItem('users')) || []

    const confirmSettings = props.confirmSettings
    const [users, setUsers] = useState(initialUsers())
    const [search, setSearch] = useState('')
    const [usersToShow, setUsersToShow] = useState(users)
    const history = useHistory()

    useEffect(() => {
        var sortedUsers = users.sort((a, b) => {
            if (a.user_type > b.user_type) {
                return 1
            }
            else if (a.user_type === b.user_type &&
                a.username > b.username) {
                return 1
            }
            else {
                return -1
            }
        })
        setUsers(sortedUsers)
        setUsersToShow(sortedUsers)
        window.localStorage.setItem('users', JSON.stringify(sortedUsers))
    }, [users])
    useEffect(() => {
        console.log('initialUsers', initialUsers())
        handleGetUsers()
    }, [])

    const handleGetUsers = async () => {
        var retObj = await userService.getallusers({})
        console.log('allusers', retObj)
        setUsers(retObj.data)
    }

    const handleDeleteUser = async (tupleObj) => {
        console.log('tupleobj', tupleObj)
        const username_to_delete = tupleObj.username
        try {
            var retObj;

            // delete account of the user
            retObj = await userService.deleteaccount(tupleObj)
            const newUsers = await users.filter(user => {
                return (user.username !== username_to_delete)
            })
            console.log('delete account success')

            //delete schedules of the user, if its user_type is "user"
            if (tupleObj.user_type === "user") {
                retObj = await scheduleService.deleteSchedule(tupleObj)
                console.log('delete schedules success')
            }

            setUsers(newUsers)
        } catch (error) {
            console.log('delete failed', error)
        }
    }
    const handleChangeSearch = async (event) => {
        console.log('handlechangsearch event', event)
        const newSearch = event.target ? event.target.value : event.search
        setSearch(newSearch)
        console.log('newSearch', newSearch)
        if (newSearch === '') {
            setUsersToShow(users)
        }
        else {
            const newSearchLow = newSearch.toString().toLowerCase()
            var newUsersToShow = await users.filter(user => {
                console.log('user', user)
                if (user.username.toLowerCase().includes(newSearchLow) ||
                    user.user_type.toLowerCase().includes(newSearchLow) ||
                    (user.register_date && user.register_date.toLowerCase().includes(newSearchLow))) {
                    return true
                }
                else {
                    return false
                }
            })
            setUsersToShow(newUsersToShow)
        }
    }
    return (
        <div>
            <AdminNavigationBar />
            <h2 style={{ color: "red" }}>Admin Panel</h2>

            <TextField
                style={{ marginTop: "1%", marginBottom: "1%" }}
                placeholder="Search..."
                onChange={handleChangeSearch}
                fullWidth={true}
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }} />
            <UsersTable users={usersToShow}
                handleDeleteUser={handleDeleteUser}
                confirmSettings={confirmSettings} />
        </div>
    )
}
export default AdminUserManagementPage