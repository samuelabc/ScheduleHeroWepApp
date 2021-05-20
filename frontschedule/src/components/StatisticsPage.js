import React, { useEffect, useState } from 'react'
import NavigationBar from './NavigationBar'
import {
    isThisMonth, isThisWeek, isToday,
    isTomorrow, isBefore, startOfToday, startOfTomorrow, isAfter
} from 'date-fns'
import {
    TableContainer, Table, TableHead, TableRow,
    TableCell, TableBody, Paper, IconButton,
    Collapse, Box, Typography, InputBase
} from '@material-ui/core'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import ConfirmPopUp from './ConfirmPopUp'
import { useHistory } from 'react-router-dom'
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import scheduleService from '../services/schedules'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'

const handleClickEditButton = (props) => {
    window.localStorage.setItem('lastpage', 'statistics');

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
    const row = props.row
    const schedules = props.schedules
    const setSchedules = props.setSchedules
    const alertSettings = props.alertSettings
    const confirmSettings = props.confirmSettings
    const handleDeleteSchedule = props.handleDeleteSchedule
    const [open, setOpen] = useState(false);
    const history = useHistory()

    return (
        <React.Fragment key={row.id} >
            <TableRow >
                <TableCell>
                    {row.content ?
                        (<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
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
                <TableCell component="th" scope="row">
                    <b> {row.title}</b>
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
            {Boolean(row.content && open) ? (
                <TableRow>
                    <TableCell
                        // style={{ paddingBottom: -1, paddingTop: 0 }}
                        colSpan={8}
                        align="center"
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
            ) : null}
        </React.Fragment>
    )
}

function Statistic(props) {
    const rows = props.rows
    const title = props.title
    const handleDeleteSchedule = props.handleDeleteSchedule
    const schedules = props.schedules
    const setSchedules = props.setSchedules
    const alertSettings = props.alertSettings
    const confirmSettings = props.confirmSettings
    const [globalOpen, setGlobalOpen] = useState(false)

    return (
        <React.Fragment key={title} >
            <TableRow>
                {/* makes 8 table cells */}
                <TableCell />
                <TableCell />
                <TableCell component="th" scope="row" align="center" >
                    <h3>{title}</h3>
                </TableCell>
                <TableCell align="left"  ><h3>{rows.length}</h3></TableCell>
                <TableCell align="left" >
                    <IconButton onClick={() => {
                        setGlobalOpen(!globalOpen)
                    }
                    } >
                        {globalOpen ?
                            <VisibilityOffIcon color="primary" fontSize="large" />
                            : <VisibilityIcon color="primary" fontSize="large" />
                        }
                    </IconButton >
                </TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
            </TableRow >

            {globalOpen ? (
                <TableRow>
                    <TableCell colSpan={8}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell />
                                    <TableCell align="left"><h4>Title</h4></TableCell>
                                    <TableCell align="center"><h4>Date</h4></TableCell>
                                    <TableCell align="center"><h4>Start time</h4></TableCell>
                                    <TableCell align="center"><h4>End time</h4></TableCell>
                                    <TableCell />
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <Row key={row.id} row={row}
                                        confirmSettings={confirmSettings}
                                        alertSettings={alertSettings}
                                        handleDeleteSchedule={handleDeleteSchedule}
                                        schedules={schedules}
                                        setSchedules={setSchedules}
                                    />
                                ))
                                }
                            </TableBody>
                        </Table>
                    </TableCell>
                </TableRow>
            )
                : null}
        </React.Fragment >
    )
}
const StatisticsTable = (props) => {
    const statistics = props.statistics
    const schedules = props.schedules
    const setSchedules = props.setSchedules
    const alertSettings = props.alertSettings
    const confirmSettings = props.confirmSettings
    const handleDeleteSchedule = props.handleDeleteSchedule

    return (
        < TableContainer component={Paper} >
            <Table>
                <TableBody>
                    {Object.keys(statistics).map((key, index) => {
                        var rows = statistics[key];
                        console.log('statistics', rows);
                        return (
                            <Statistic rows={rows} key={key} title={key}
                                handleDeleteSchedule={handleDeleteSchedule}
                                confirmSettings={confirmSettings}
                                alertSettings={alertSettings}
                                schedules={schedules}
                                setSchedules={setSchedules}
                            />
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer >
    )
}

const StatisticsPage = (props) => {
    const schedules = props.schedules
    const setSchedules = props.setSchedules
    const alertSettings = props.alertSettings
    const confirmSettings = props.confirmSettings

    const handleDeleteSchedule = async (tupleObj) => {
        console.log('tupleobj', tupleObj)
        const schedule_id = tupleObj.schedule_id
        try {
            await scheduleService.deleteSchedule({ schedule_id: schedule_id })
            const newSchedules = await schedules.filter(schedule => {
                return (schedule.id !== schedule_id)
            })
            setSchedules(newSchedules)
            console.log('delete success')
        } catch (error) {
            console.log('delete failed', error)
        }
    }

    const statistics = {
        'All': schedules,
        'All completed': schedules.filter(schedule => {
            return (schedule.completed === "true" ? true : false)
        }),
        'All ongoing': schedules.filter(schedule => {
            return (schedule.completed === "false" ? true : false)
        }),
        'Past': schedules.filter(schedule => {
            if (isBefore(new Date(schedule.date), startOfToday())) {
                return true
            }
            else {
                return false
            }
        }),
        'Today\'s ': schedules.filter(schedule => {
            if (isToday(new Date(schedule.date))) {
                return true
            }
            else {
                return false
            }
        }),
        'Tomorrow\'s': schedules.filter(schedule => {
            if (isTomorrow(new Date(schedule.date))) {
                return true
            }
            else {
                return false
            }
        }),
        'Tomorrow and beyond\'s': schedules.filter(schedule => {
            if (isAfter(new Date(schedule.date), startOfTomorrow())) {
                return true
            }
            else {
                return false
            }
        }),
        'This week\'s': schedules.filter(schedule => {
            if (isThisWeek(new Date(schedule.date))) {
                return true
            }
            else {
                return false
            }
        }),
        'This month\'s': schedules.filter(schedule => {
            if (isThisMonth(new Date(schedule.date))) {
                return true
            }
            else {
                return false
            }
        })
    }
    return (
        <div>
            <NavigationBar />
            <h1>Statistics</h1>

            <StatisticsTable
                statistics={statistics}
                schedules={schedules}
                setSchedules={setSchedules}
                alertSettings={alertSettings}
                confirmSettings={confirmSettings}
                handleDeleteSchedule={handleDeleteSchedule}
            />
        </div>
    );

}
export default StatisticsPage