import React, { useEffect, useState } from 'react'
import NavigationBar from './NavigationBar'
import scheduleService from '../services/schedules'
import { Link, useHistory } from 'react-router-dom'
import ScheduleTable from './SchedulesTable'
import SearchIcon from '@material-ui/icons/Search'
import {
    InputBase, TextField, Select, MenuItem, InputLabel, FormControl,
    makeStyles, InputAdornment, Switch, FormControlLabel, Button
} from '@material-ui/core'
import { endOfToday, isToday, startOfToday, isBefore, isTomorrow, isAfter, isThisWeek, isThisMonth, endOfTomorrow, endOfYesterday } from 'date-fns'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import startOfTomorrow from 'date-fns/startOfTomorrow'

const SchedulePage = (props) => {
    console.log('props of schedulepage', props)
    const schedules = props.schedules
    const setSchedules = props.setSchedules
    const confirmSettings = props.confirmSettings
    const alertSettings = props.alertSettings

    const initialShowAllContent = () => window.localStorage.getItem('showAllContent') === "true" || false
    const initialShowCompletedSchedule = () => window.localStorage.getItem('showCompletedSchedule') === "true" || false
    const initialTimeTimeRange = () => {
        if (window.localStorage.getItem('timeRange')) {
            return parseInt(window.localStorage.getItem('timeRange'))
        }
        return 4
    }
    const [search, setSearch] = useState('')
    const [timeRange, setTimeRange] = useState(initialTimeTimeRange)
    const [schedulesToShow, setSchedulesToShow] = useState(schedules)
    const [schedulestimeRange, setScheduleTimeRange] = useState(schedules)
    const [showAllContent, setShowAllContent] = useState(initialShowAllContent)
    const [showCompletedSchedule, setShowCompletedSchedule] = useState(initialShowCompletedSchedule)
    const history = useHistory()

    useEffect(() => {
        window.localStorage.setItem('timeRange', timeRange)
    }, [timeRange])
    useEffect(() => {
        window.localStorage.setItem('showAllContent', showAllContent)
    }, [showAllContent])
    useEffect(() => {
        window.localStorage.setItem('showCompletedSchedule', showCompletedSchedule)
    }, [showCompletedSchedule])
    useEffect(() => {
        console.log('schedule page schedules', schedules)
        // setScheduleTimeRange(schedules)
        handleChangeTimeRange({ timeRange: timeRange })
    }, [schedules])
    useEffect(() => {
        console.log('schedulestimeRange', schedulestimeRange)
        // setSchedulesToShow(schedulestimeRange)
        handleChangeSearch({ search: search })
    }, [schedulestimeRange])

    const handleJumpToCreateSchedulePage = () => {
        history.push('/createschedule')
    }
    const handleEditSchedule = async (tupleObj) => {
        console.log('handleeditschedule', tupleObj)
        const old_id = tupleObj.old_id
        const new_id = tupleObj.new_id
        try {
            const retObj = await scheduleService.editSchedule(tupleObj)
            const newSchedules = await schedules.map(schedule => {
                return (schedule.id === old_id ? retObj : schedule)
            })
            setSchedules(newSchedules)
            console.log('edit success')
        } catch (error) {
            console.log('edit failed', error)
            window.alert('edit failed')
        }
    }
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
    const handleChangeSearch = async (event) => {
        const newSearch = event.target ? event.target.value : event.search
        setSearch(newSearch)
        if (newSearch === '') {
            setSchedulesToShow(schedulestimeRange)
        }
        else {
            var newSchedulesToShow = await schedulestimeRange.filter(schedule => {
                if (schedule.title.toLowerCase().includes(newSearch.toLowerCase()) ||
                    schedule.content.toLowerCase().includes(newSearch.toLowerCase())) {
                    return true
                }
                else {
                    return false
                }
            })
            setSchedulesToShow(newSchedulesToShow)
        }
    }
    const handleChangeTimeRange = async (event) => {
        const newTimeRange = event.target ? event.target.value : event.timeRange
        setTimeRange(newTimeRange)

        var newSchedulesTimeRange = []
        if (newTimeRange === 0) { //All
            newSchedulesTimeRange = await schedules
        }
        else if (newTimeRange === 1) {  //All completed
            newSchedulesTimeRange = await schedules.filter(schedule => {
                return (schedule.completed === "true" ? true : false)
            })
            setShowCompletedSchedule(true)
        }
        else if (newTimeRange === 2) {  //All ongoing
            newSchedulesTimeRange = await schedules.filter(schedule => {
                return (schedule.completed === "false" ? true : false)
            })
        }
        else if (newTimeRange === 3) {//past
            newSchedulesTimeRange = await schedules.filter(schedule => {
                if (isBefore(new Date(schedule.date), startOfToday())) {
                    return true
                }
                else {
                    return false
                }
            })
        }
        else if (newTimeRange === 4) { //Today
            newSchedulesTimeRange = await schedules.filter(schedule => {
                if (isToday(new Date(schedule.date))) {
                    return true
                }
                else {
                    return false
                }
            })
        }
        else if (newTimeRange === 5) { //Today and tomorrow
            newSchedulesTimeRange = await schedules.filter(schedule => {
                if (isToday(new Date(schedule.date)) || isTomorrow(new Date(schedule.date))) {
                    return true
                }
                else {
                    return false
                }
            })
        }
        else if (newTimeRange === 6) { //This week
            newSchedulesTimeRange = await schedules.filter(schedule => {
                if (isThisWeek(new Date(schedule.date))) {
                    return true
                }
                else {
                    return false
                }
            })
        }
        else if (newTimeRange === 7) { //This month
            newSchedulesTimeRange = await schedules.filter(schedule => {
                if (isThisMonth(new Date(schedule.date))) {
                    return true
                }
                else {
                    return false
                }
            })
        }
        else if (newTimeRange === 8) { //Today and future
            newSchedulesTimeRange = await schedules.filter(schedule => {
                if (isAfter(new Date(schedule.date), endOfYesterday())) {
                    return true
                }
                else {
                    console.log('today and future', new Date(schedule.date), endOfYesterday(), isAfter(new Date(schedule.date), startOfToday()))
                    return false
                }
            })
        }
        setScheduleTimeRange(newSchedulesTimeRange)
    }
    const useStyles = makeStyles((theme) => ({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
    }));
    const classes = useStyles()
    console.log('scheduletoshow in schedulepage', schedulesToShow, schedules)
    return (
        <div>
            <NavigationBar />
            <h1>Schedules </h1>
            <div>
                <Button onClick={handleJumpToCreateSchedulePage}
                    variant="contained" color="primary"
                    startIcon={<AddCircleIcon />} size="large"
                    style={{ marginBottom: "2%" }}
                >
                    New Schedule
                </Button>
                <FormControlLabel style={{ paddingTop: 10, position: 'absolute', left: '70%' }}
                    control={<Switch checked={showCompletedSchedule}
                        onChange={() => { setShowCompletedSchedule(prev => !prev) }} />}
                    label="Show completed schedule"
                />
            </div>
            <div>
                <FormControl className={classes.formControl}
                    style={{ width: "40%", marginBottom: "2%" }}>
                    <InputLabel>Filter</InputLabel>
                    <Select value={timeRange} onChange={handleChangeTimeRange}>
                        <MenuItem value={0} >All</MenuItem>
                        <MenuItem value={1} >All completed</MenuItem>
                        <MenuItem value={2} >All ongoing</MenuItem>
                        <MenuItem value={3} >Past</MenuItem>
                        <MenuItem value={4}>Today</MenuItem>
                        <MenuItem value={5}>Today and tomorrow</MenuItem>
                        <MenuItem value={6}>This week</MenuItem>
                        <MenuItem value={7}>This month</MenuItem>
                        <MenuItem value={8}>Today and beyond</MenuItem>
                    </Select>
                </FormControl>
                <FormControlLabel style={{ paddingTop: 10, position: 'absolute', left: '70%' }}
                    control={
                        <Switch checked={showAllContent}
                            onChange={() => { setShowAllContent(prev => !prev) }}
                        />}
                    label="Expand all content"
                />
                <TextField
                    style={{ marginBottom: "1%" }}
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
            </div>

            <ScheduleTable schedules={schedulesToShow}
                setSchedules={setSchedules}
                handleDeleteSchedule={handleDeleteSchedule}
                handleEditSchedule={handleEditSchedule}
                confirmSettings={confirmSettings}
                alertSettings={alertSettings}
                showAllContent={showAllContent}
                showCompletedSchedule={showCompletedSchedule}
            />
        </div>
    )
}

export default SchedulePage