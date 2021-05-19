import React, { useState, useRef, useEffect } from 'react'
import {
    TableContainer, Table, TableHead, TableRow,
    TableCell, TableBody, Paper, IconButton,
    Collapse, Box, Typography, TextField, InputBase
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import scheduleService from '../services/schedules'
import userService from '../services/users'
import DeleteIcon from '@material-ui/icons/Delete'
import { differenceInDays } from 'date-fns'
import startOfToday from 'date-fns/startOfToday'

const handleClickDeleteButton = (props) => {
    const confirmSettings = props.confirmSettings
    const handleDeleteUser = props.handleDeleteUser
    const username = props.username
    const user_type = props.user_type
    const password = props.password
    console.log('confirmSettings', confirmSettings)
    console.log('handleClickDeleteButton props', props)
    confirmSettings.setConfirmTitle("Remove this user?")
    confirmSettings.setConfirmProps({
        username: username,
        user_type: user_type,
        password: password
    })
    confirmSettings.setConfirmUpperHandleConfirm(() => handleDeleteUser)
    confirmSettings.confirmRef.current.changeVisibility()
}
const UsersTable = (props) => {
    const handleDeleteUser = props.handleDeleteUser
    const users = props.users
    const confirmSettings = props.confirmSettings
    console.log('userstable props', props)
    return (
        <div>
            < TableContainer component={Paper} >
                <Table aria-label="collapsible table" size="large">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center"><h5>Username</h5></TableCell>
                            <TableCell align="center"><h5>User type</h5></TableCell>
                            <TableCell align="center"><h5>Register Date</h5></TableCell>
                            <TableCell align="center"><h5>Registered for how many days</h5></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((row) => (
                            <React.Fragment key={row.username}>
                                <TableRow >
                                    <TableCell component="th" scope="row" align="center">
                                        <b>{row.username}</b>
                                    </TableCell>
                                    <TableCell align="center">{row.user_type}</TableCell>
                                    <TableCell align="center">{row.register_date ? new Date(parseInt(row.register_date)).toLocaleDateString(
                                        [], { hour: '2-digit', minute: '2-digit' })
                                        : "None"
                                    }</TableCell>
                                    <TableCell align="center">
                                        {row.register_date
                                            ? differenceInDays(startOfToday(), new Date(parseInt(row.register_date)))
                                            : null}
                                    </TableCell>
                                    {row.user_type !== "admin" ?
                                        <TableCell>
                                            <IconButton onClick={() => {
                                                handleClickDeleteButton({
                                                    confirmSettings: confirmSettings,
                                                    username: row.username,
                                                    user_type: row.user_type,
                                                    password: row.password,
                                                    handleDeleteUser: handleDeleteUser
                                                })
                                            }
                                            } >
                                                <DeleteIcon color="secondary" fontSize="large" />
                                            </IconButton>
                                        </TableCell>
                                        : null
                                    }
                                </TableRow >
                            </React.Fragment >
                        ))}
                    </TableBody>
                </Table>
            </TableContainer >
        </div>
    )
}
export default UsersTable
