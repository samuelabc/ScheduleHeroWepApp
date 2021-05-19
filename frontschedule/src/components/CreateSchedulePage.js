import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Service from '../services/schedules'
import NavigationBar from './NavigationBar'
import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { getTime, format } from 'date-fns'
import { Button } from 'react-bootstrap';
import { TextareaAutosize, TextField } from '@material-ui/core'

const CreateSchedulePage = (props) => {
    const schedules = props.schedules
    const setSchedules = props.setSchedules
    const alertSettings = props.alertSettings
    const [date, setDate] = useState(new Date())
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [startTime, setStartTime] = useState(new Date())
    const [endTime, setEndTime] = useState(null)
    const history = useHistory()

    async function addZero(i) {
        if (i < 10) {
            i = "0" + i
        }
        return String(i)
    }
    async function checkError() {
        if (title.length === 0) {
            alertSettings.setAlertTitle('Create schedule failed')
            alertSettings.setAlertDescription('Title should not be empty.')
            alertSettings.alertRef.current.changeVisibility()
            return 1
        }
        else if (title.length > 80) {
            alertSettings.setAlertTitle('Create schedule failed')
            alertSettings.setAlertDescription('Title should not be longer than 80 characters.')
            alertSettings.alertRef.current.changeVisibility()
            return 2
        }
        for (let i = 0; i < title.length; i++) {
            if (!(title[i] >= '\x00' && title[i] <= '\xff')) {
                alertSettings.setAlertTitle('Create schedule failed')
                alertSettings.setAlertDescription('Title should only consists of ASCII characters.')
                alertSettings.alertRef.current.changeVisibility()
                return 3
            }
        }
        if (content.length > 10000) {
            alertSettings.setAlertTitle('Create schedule failed')
            alertSettings.setAlertDescription('Content should not be longer than 10000 characters.')
            alertSettings.alertRef.current.changeVisibility()
            return 4
        }
        for (let i = 0; i < content.length; i++) {
            if (!(content[i] >= '\x00' && content[i] <= '\xff')) {
                alertSettings.setAlertTitle('Create schedule failed')
                alertSettings.setAlertDescription('Content should only consists of ASCII characters.')
                alertSettings.alertRef.current.changeVisibility()
                return 5
            }
        }
        if (endTime && startTime > endTime) {
            alertSettings.setAlertTitle('Create schedule failed')
            alertSettings.setAlertDescription('End time should not be earlier than start time.')
            alertSettings.alertRef.current.changeVisibility()
            return 6
        }
        return 0
    }
    async function getId() {
        var year = await addZero(date.getFullYear())
        var month = await addZero(date.getMonth())
        var day = await addZero(date.getDate())
        var tempDate = year + month + day
        var tempStartTime = await addZero(startTime.getHours()) + await addZero(startTime.getMinutes())
        var tempEndTime = null
        if (tempEndTime !== null) {
            tempEndTime = await addZero(endTime.getHours()) + await addZero(endTime.getMinutes())
        }
        var username = window.localStorage.getItem('username')
        var id = username + "-" + tempDate + "-" + tempStartTime + "-" +
            new Date().getTime().toString()
        return id
    }
    const handleScheduleCreate = async (event) => {
        event.preventDefault()
        const errCode = await checkError()
        console.log('errcode', errCode)
        if (errCode !== 0) {
            return errCode
        }
        const tupleObj = {
            id: await getId(), date: date.toDateString(), title, content,
            start_time: startTime.getTime().toString(),
            end_time: `${endTime ? endTime.getTime().toString() : endTime}`,
            completed: "false"
        }
        try {
            console.log('handleschedulecreate in createschedulepage')
            var retObj = await Service.createSchedule(tupleObj)
            console.log('create success', retObj)
            setDate(new Date())
            setTitle('')
            setContent('')
            setStartTime(new Date())
            setEndTime(null)
            setSchedules(schedules.concat(retObj))
        } catch (error) {
            console.log('create failed')
            alertSettings.setAlertTitle('Create schedule failed')
            alertSettings.setAlertDescription('Something wrong.')
            alertSettings.alertRef.current.changeVisibility()
        }
    }
    const handleJumpToSchedulePage = () => {
        history.push('/schedules')
    }
    return (
        <div>
            <NavigationBar />
            <h2>Create new schedule</h2>
            <form onSubmit={handleScheduleCreate} >
                <div>
                    <h4>Date</h4>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker label="Date" format="yyyy/MM/dd" variant="static"
                            value={date} onChange={setDate}
                            inputVariant="outlined" orientation="landscape" />
                    </MuiPickersUtilsProvider>
                </div>
                <div>
                    <h4>Time</h4>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} >
                        <KeyboardTimePicker label="Start time"
                            inputVariant="outlined" orientation="landscape"
                            value={startTime} onChange={setStartTime} />
                        <KeyboardTimePicker label="End time" clearable
                            inputVariant="outlined" orientation="landscape"
                            value={endTime} onChange={setEndTime} />
                    </MuiPickersUtilsProvider>
                </div>
                <div>
                    <h4>Title</h4>
                    <TextField type='text'
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                        variant="outlined" fullWidth={true}
                    // required={true}
                    />
                </div>
                <div>
                    <h4>Content</h4>
                    <TextField type='text'
                        value={content}
                        onChange={({ target }) => setContent(target.value)}
                        variant="outlined" fullWidth={true}
                        multiline={true} rows={10}
                    />
                </div>
                <div>
                    <Button size="lg" type="submit" variant="success">Confirm</Button>
                    <Button size="lg" type="button" variant="light"
                        onClick={handleJumpToSchedulePage}>Cancel</Button>
                </div>
            </form>
        </div>
    )
}
export default CreateSchedulePage