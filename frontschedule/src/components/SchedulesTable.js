import React, { useState, useRef, useEffect } from 'react'
import {
    TableContainer, Table, TableHead, TableRow,
    TableCell, TableBody, Paper, IconButton,
    Collapse, Box, Typography, TextField, InputBase
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import DeleteIcon from '@material-ui/icons/Delete'
import scheduleService from '../services/schedules'
import EditIcon from '@material-ui/icons/Edit'
import ConfirmPopUp from './ConfirmPopUp'
import schedules from '../services/schedules'
import { useHistory } from 'react-router-dom'
import DoneIcon from '@material-ui/icons/Done'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

const handleClickEditButton = (props) => {
    // for redirecting purpose
    window.localStorage.setItem('lastpage', 'schedules');

    const history = props.history
    const schedule = props.row
    history.push(`/editschedule/${schedule.id}`)
}
const handleClickDeleteButton = (props) => {
    const confirmSettings = props.confirmSettings
    const handleDeleteSchedule = props.handleDeleteSchedule
    const schedule_id = props.schedule_id
    // console.log('confirmSettings', confirmSettings)
    confirmSettings.setConfirmTitle("Delete this schedule?")
    confirmSettings.setConfirmProps({ schedule_id: schedule_id })
    confirmSettings.setConfirmUpperHandleConfirm(() => handleDeleteSchedule)
    confirmSettings.confirmRef.current.changeVisibility()
}
const handleClickCompleteButton = (props) => {
    const cur_completed = props.completed
    const confirmSettings = props.confirmSettings
    const schedule_id = props.schedule_id
    const schedule = props.schedule
    const schedules = props.schedules
    const setSchedules = props.setSchedules
    const alertSettings = props.alertSettings

    cur_completed === "true"
        ? confirmSettings.setConfirmTitle(`Mark this schedule as "ongoing"?`)
        : confirmSettings.setConfirmTitle(`Mark this schedule as "completed"?`)
    const new_completed = (cur_completed === "true" ? "false" : "true")

    confirmSettings.setConfirmProps({
        schedule_id: schedule_id,
        schedule: schedule,
        schedules: schedules,
        setSchedules: setSchedules,
        completed: new_completed,
        alertSettings: alertSettings
    })
    confirmSettings.setConfirmUpperHandleConfirm(() => handleChangeCompleted)
    confirmSettings.confirmRef.current.changeVisibility()
}
const handleChangeCompleted = async (props) => {
    const new_id = props.schedule_id
    const old_id = props.schedule_id
    const completed = props.completed
    const schedule = props.schedule
    const schedules = props.schedules
    const setSchedules = props.setSchedules
    const alertSettings = props.alertSettings
    const tupleObj = {
        new_id: new_id,
        old_id: old_id,
        ...schedule,
        completed: completed,
    }
    try {
        var retObj = await scheduleService.editSchedule(tupleObj)
        console.log('change complete success', retObj)
        const newSchedules = await schedules.map(schedule => {
            return (schedule.id === old_id) ? retObj : schedule
        })
        setSchedules(newSchedules)
    } catch (error) {
        console.log('change completed failed')
        alertSettings.setAlertTitle('change completed failed')
        alertSettings.setAlertDescription('Something went wrong.')
        alertSettings.alertRef.current.changeVisibility()
    }
}
function Row(props) {
    // console.log('row props', props)
    const row = props.row;
    const confirmSettings = props.confirmSettings
    const alertSettings = props.alertSettings
    const handleDeleteSchedule = props.handleDeleteSchedule
    const showAllContent = props.showAllContent
    const [open, setOpen] = useState(showAllContent);
    const classes = useRowStyles()
    const history = useHistory()
    const schedules = props.schedules
    const setSchedules = props.setSchedules

    useEffect(() => {
        setOpen(showAllContent)
    }, [showAllContent])
    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    {row.content ?
                        (<IconButton aria-label="expand row" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon fontSize="large" />
                                : <KeyboardArrowDownIcon fontSize="large" />}
                        </IconButton>)
                        : null
                    }
                </TableCell>
                <TableCell align="left">
                    <IconButton onClick={() => handleClickCompleteButton({
                        completed: row.completed,
                        confirmSettings: confirmSettings,
                        alertSettings: alertSettings,
                        schedule_id: row.id,
                        schedule: row,
                        schedules: schedules,
                        setSchedules: setSchedules,
                    })}>
                        {row.completed === "true"
                            ? <CheckCircleOutlineIcon style={{ color: "green" }} fontSize="large" />
                            : <CheckCircleOutlineIcon style={{ color: "grey" }} fontSize="large" />
                        }
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" align="left">
                    <b>
                        {row.title}
                    </b>
                </TableCell>
                <TableCell align="center">{new Date(row.date).toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' })}</TableCell>
                <TableCell align="center">{new Date(parseInt(row.start_time)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                <TableCell align="center">{row.end_time > -1 ?
                    new Date(parseInt(row.end_time)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : "None"
                }
                </TableCell>
                <TableCell align="right">
                    <IconButton onClick={() => {
                        handleClickEditButton({ history, row })
                    }}>
                        <EditIcon color="primary" fontSize="large" />
                    </IconButton>
                </TableCell>
                <TableCell aligh="left">
                    <IconButton onClick={() => {
                        handleClickDeleteButton({
                            confirmSettings: confirmSettings,
                            schedule_id: row.id,
                            handleDeleteSchedule: handleDeleteSchedule
                        })
                    }
                    } >
                        <DeleteIcon color="secondary" fontSize="large" />
                    </IconButton>
                </TableCell>
            </TableRow >
            <TableRow>
                <TableCell
                    style={{ paddingBottom: -1, paddingTop: 0 }}
                    colSpan={8}
                >
                    <Collapse in={Boolean(row.content && open)} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <InputBase
                                type='text' value={row.content}
                                variant="outlined" fullWidth={true}
                                multiline={true}
                                readOnly={true}
                            />
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment >
    );
}
const SchedulesTable = (props) => {
    // const handleEditSchedule = props.handleEditSchedule
    const handleDeleteSchedule = props.handleDeleteSchedule
    const schedules = props.schedules
    const setSchedules = props.setSchedules
    const confirmSettings = props.confirmSettings
    const alertSettings = props.alertSettings
    const showAllContent = props.showAllContent
    const showCompletedSchedule = props.showCompletedSchedule

    console.log('schedules in schedulestable', schedules)
    // console.log('props', props)
    return (
        <div>
            < TableContainer component={Paper} >
                <Table aria-label="collapsible table" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell />
                            <TableCell align="left"><h4>Title</h4></TableCell>
                            <TableCell align="center"><h4>Date</h4></TableCell>
                            <TableCell align="center"><h4>Start time</h4></TableCell>
                            <TableCell align="center"><h4>End time</h4></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {schedules.map((schedule) => {
                            if (showCompletedSchedule === false && schedule.completed === "true") {
                                return (null)
                            }
                            return (
                                <Row key={schedule.id} row={schedule}
                                    confirmSettings={confirmSettings}
                                    alertSettings={alertSettings}
                                    handleDeleteSchedule={handleDeleteSchedule}
                                    showAllContent={showAllContent}
                                    schedules={schedules}
                                    setSchedules={setSchedules}
                                    showCompletedSchedule={showCompletedSchedule}
                                />
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer >
        </div>
    );
}

export default SchedulesTable