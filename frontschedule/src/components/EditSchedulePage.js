import React, { useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import Service from '../services/schedules'
import NavigationBar from './NavigationBar'
import {
    MuiPickersUtilsProvider, KeyboardDatePicker,
    KeyboardTimePicker
} from '@material-ui/pickers'
import { TextField } from '@material-ui/core'
import DateFnsUtils from '@date-io/date-fns'
import { getTime, format, toDate, parseJSON } from 'date-fns'
import { Button } from 'react-bootstrap';

const EditSchedulePage = (props) => {
    const history = useHistory()
    console.log('editschedulepage props', props)
    const url_id = useParams().id
    console.log('url_id', useParams().id)

    // const schedules = JSON.parse(window.localStorage.getItem('schedules'))
    const schedules = props.schedules
    console.log('schedules', schedules)

    const setSchedules = props.setSchedules
    const editSchedule = schedules.find((schedule) => {
        if (schedule.id === url_id) {
            return true
        }
        return false
    })
    console.log('editschedule', editSchedule)
    const alertSettings = props.alertSettings
    const [date, setDate] = useState(new Date(editSchedule.date))
    const [title, setTitle] = useState(editSchedule.title)
    const [content, setContent] = useState(editSchedule.content)
    const [startTime, setStartTime] = useState(new Date(parseInt(editSchedule.start_time)))
    const editEndTime = () => editSchedule.end_time === 'null' ? null : new Date(parseInt(editSchedule.end_time))
    const [endTime, setEndTime] = useState(editEndTime())

    console.log('edit date', date)
    console.log('edit start time', startTime)
    console.log('edit end time', endTime)
    async function addZero(i) {
        if (i < 10) {
            i = "0" + i
        }
        return String(i)
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
    async function checkError() {
        if (title.length === 0) {
            alertSettings.setAlertTitle('Edit schedule failed')
            alertSettings.setAlertDescription('Title should not be empty.')
            alertSettings.alertRef.current.changeVisibility()
            return 1
        }
        else if (title.length > 100) {
            alertSettings.setAlertTitle('Edit schedule failed')
            alertSettings.setAlertDescription('Title should not be longer than 100 characters.')
            alertSettings.alertRef.current.changeVisibility()
            return 2
        }
        for (let i = 0; i < title.length; i++) {
            if (!(title[i] >= '\x00' && title[i] <= '\xff')) {
                alertSettings.setAlertTitle('Edit schedule failed')
                alertSettings.setAlertDescription('Title should only consists of ASCII characters.')
                alertSettings.alertRef.current.changeVisibility()
                return 3
            }
        }
        if (content.length > 10000) {
            alertSettings.setAlertTitle('Edit schedule failed')
            alertSettings.setAlertDescription('Content should not be longer than 10000 characters.')
            alertSettings.alertRef.current.changeVisibility()
            return 4
        }
        for (let i = 0; i < content.length; i++) {
            if (!(content[i] >= '\x00' && content[i] <= '\xff')) {
                alertSettings.setAlertTitle('Edit schedule failed')
                alertSettings.setAlertDescription('Content should only consists of ASCII characters.')
                alertSettings.alertRef.current.changeVisibility()
                return 5
            }
        }
        if (endTime && startTime > endTime) {
            alertSettings.setAlertTitle('Edit schedule failed')
            alertSettings.setAlertDescription('End time should not be earlier than start time.')
            alertSettings.alertRef.current.changeVisibility()
            return 6
        }
        return 0
    }
    const handleScheduleEdit = async (event) => {
        event.preventDefault()
        const errCode = await checkError()
        console.log('errcode', errCode)
        if (errCode !== 0) {
            return errCode
        }

        const new_id = await getId()
        const old_id = editSchedule.id
        const tupleObj = {
            new_id: new_id, old_id: old_id, date: date.toDateString(), title, content,
            start_time: startTime.getTime().toString(),
            end_time: `${endTime ? endTime.getTime().toString() : endTime}`,
            completed: editSchedule.completed
        }
        try {
            console.log('handleScheduleEdit in editschedulepage')
            var retObj = await Service.editSchedule(tupleObj)
            console.log('edit success', retObj)
            const newSchedules = await schedules.map(schedule => {
                return (schedule.id === old_id) ? retObj : schedule
            })

            // setDate(new Date())
            // setTitle('')
            // setContent('')
            // setStartTime(new Date())
            // setEndTime(null)

            handleJumpToSchedulePage()
            setSchedules(newSchedules)
        } catch (error) {
            console.log('edit failed')
            alertSettings.setAlertTitle('Edit schedule failed')
            alertSettings.setAlertDescription('Something wrong.')
            alertSettings.alertRef.current.changeVisibility()
        }
    }

    const handleJumpToSchedulePage = () => {
        const lastpage = localStorage.getItem('lastpage')
        if (lastpage === "statistics") {
            history.push('/statistics')
        }
        else {
            history.push('/schedules')
        }
    }
    return (
        <div>
            <NavigationBar />
            <h1>Edit schedule</h1>
            <form onSubmit={handleScheduleEdit} >
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
export default EditSchedulePage