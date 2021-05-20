import React, { useEffect, useRef, useState } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useRouteMatch,
  useHistory,
  withRouter
} from 'react-router-dom';
import './App.css'
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import UserAccountPage from './components/UserAccountPage';
import DeleteAccountPage from './components/DeleteAccountPage';
import SchedulePage from './components/SchedulePage'
import CreateSchedulePage from './components/CreateSchedulePage'
import NotExistPage from './components/NotExistPage'
import scheduleService from './services/schedules'
import userService from './services/users'
import EditSchedulePage from './components/EditSchedulePage'
import ConfirmPopUp from './components/ConfirmPopUp'
import AlertPopUp from './components/AlertPopUp'
import StatisticsPage from './components/StatisticsPage';
import AdminUserManagementPage from './components/AdminUserManagementPage'
import AdminAccountPage from './components/AdminAccountPage'
const App = () => {
  const initialUsername = () => window.localStorage.getItem('username') || ''
  const initialUserType = () => window.localStorage.getItem('userType') || ''
  const initialRegisterDate = () => window.localStorage.getItem('registerDate') || ''
  const initialToken = () => window.localStorage.getItem('token') || ''
  const initialSchedules = () => JSON.parse(window.localStorage.getItem('schedules')) || []

  const [username, setUsername] = useState(initialUsername)
  const [userType, setUserType] = useState(initialUserType)
  const [registerDate, setRegisterDate] = useState(initialRegisterDate)
  const [token, setToken] = useState(initialToken)
  const [schedules, setSchedules] = useState(initialSchedules)

  //confirm pop up
  const confirmRef = useRef()
  const [confirmTitle, setConfirmTitle] = useState('')
  const [confirmDescription, setConfirmDescription] = useState('')
  const [confirmUpperHandleConfirm, setConfirmUpperHandleConfirm] = useState()
  const [confirmProps, setConfirmProps] = useState({})
  const confirmSettings = {
    confirmRef: confirmRef,
    setConfirmTitle: setConfirmTitle,
    setConfirmDescription: setConfirmDescription,
    setConfirmUpperHandleConfirm: setConfirmUpperHandleConfirm,
    setConfirmProps: setConfirmProps
  }

  //alert pop up
  const alertRef = useRef()
  const [alertTitle, setAlertTitle] = useState('')
  const [alertDescription, setAlertDescription] = useState('')
  const alertSettings = {
    alertRef: alertRef,
    setAlertTitle: setAlertTitle,
    setAlertDescription: setAlertDescription
  }

  useEffect(() => {
    console.log('useeffect username', username)
    const getSchedules = async (props) => {
      try {
        var retObj = await scheduleService.getSchedule()
        console.log('retobj', retObj)
        console.log('set schedules as retobj')
        setSchedules(retObj)
      } catch (error) {
        console.log('get schedules error')
      }
    }
    async function saveToLocalstorage() {
      console.log('saveToLocalstorage')
      if (username === '') {
        window.localStorage.clear()
        console.log('local storage cleared')
      }
      else {
        window.localStorage.setItem('username', username)
        window.localStorage.setItem('userType', userType)
        window.localStorage.setItem('registerDate', registerDate)
        window.localStorage.setItem('token', token)
        console.log('localstorage saved', username, userType, registerDate, token)
        if (userType !== 'admin') {
          await getSchedules()
        }
      }
    }
    document.title = "Schedule Hero"
    saveToLocalstorage()
  }, [username])
  useEffect(() => {
    console.log('useeffect schedules', schedules)
    async function sortSchedules() {
      var sortedSchedules = await schedules.sort((a, b) => {
        if (a.id > b.id) {
          return 1
        }
        else {
          return -1
        }
      })
      setSchedules(sortedSchedules)
      window.localStorage.setItem('schedules', JSON.stringify(sortedSchedules))
    }
    sortSchedules()
  }, [schedules])

  return (
    <Router>
      <ConfirmPopUp ref={confirmRef}
        title={confirmTitle}
        description={confirmDescription}
        confirmProps={confirmProps}
        upperHandleConfirm={confirmUpperHandleConfirm} />
      <AlertPopUp ref={alertRef}
        title={alertTitle}
        description={alertDescription} />
      <div className='container'>
        <Switch>
          <Route path='/login'>
            {
              username === ''
                ? <LoginPage setUsername={setUsername} setUserType={setUserType}
                  alertSettings={alertSettings}
                  setRegisterDate={setRegisterDate}
                  setToken={setToken} />
                : <Redirect to={'/schedules'} />
            }
          </Route>
          <Route path='/register'>
            <RegisterPage alertSettings={alertSettings} />
          </Route>
          <Route path='/adminaccount'>
            {() => {
              if (username === '') {
                return <Redirect to={'/login'} />
              }
              else if (userType !== 'admin') {
                return <Redirect to={'/schedulepage'} />
              }
              else {
                return <AdminAccountPage
                  username={username}
                  userType={userType}
                  setUsername={setUsername} setUserType={setUserType} />
              }
            }
            }
          </Route>
          <Route path='/adminusermanagement'>
            {() => {
              if (username === '') {
                return <Redirect to={'/login'} />
              }
              else if (userType !== 'admin') {
                return <Redirect to={'/schedulepage'} />
              }
              else {
                return <AdminUserManagementPage confirmSettings={confirmSettings} />
              }
            }
            }
          </Route>
          <Route path='/useraccount'>
            {() => {
              if (username === '') {
                return <Redirect to={'/login'} />
              }
              else if (userType !== 'admin') {
                return <UserAccountPage setUsername={setUsername} setUserType={setUserType}
                  username={username}
                  userType={userType}
                  registerDate={registerDate}
                  alertSettings={alertSettings}
                  setSchedules={setSchedules} />
              }
              else {
                return <Redirect to={'/adminaccount'} />
              }
            }
            }
          </Route>
          <Route path='/deleteaccount'>
            {username === ''
              ? <Redirect to={'/login'} />
              : <DeleteAccountPage setUsername={setUsername} setUserType={setUserType}
                alertSettings={alertSettings} />
            }
          </Route>
          <Route path='/schedules'>
            {() => {
              if (username === '') {
                return <Redirect to={'/login'} />
              }
              else if (userType !== 'admin') {
                return <SchedulePage schedules={schedules}
                  setSchedules={setSchedules}
                  confirmSettings={confirmSettings}
                  alertSettings={alertSettings}
                />
              }
              else {
                return <Redirect to={'/adminaccount'} />
              }
            }
            }
          </Route>
          <Route path='/createschedule'>
            {() => {
              if (username === '') {
                return <Redirect to={'/login'} />
              }
              else if (userType !== 'admin') {
                return <CreateSchedulePage
                  schedules={schedules} setSchedules={setSchedules}
                  alertSettings={alertSettings} />
              }
              else {
                return <Redirect to={'/adminaccount'} />
              }
            }
            }
          </Route>
          <Route path='/editschedule/:id'>
            {() => {
              if (username === '') {
                return <Redirect to={'/login'} />
              }
              else if (userType !== 'admin') {
                return <EditSchedulePage
                  schedules={schedules} setSchedules={setSchedules}
                  alertSettings={alertSettings} />
              }
              else {
                return <Redirect to={'/adminaccount'} />
              }
            }
            }
          </Route>
          <Route path='/statistics'>
            {() => {
              if (username === '') {
                return <Redirect to={'/login'} />
              }
              else if (userType !== 'admin') {
                return <StatisticsPage
                  schedules={schedules}
                  setSchedules={setSchedules}
                  confirmSettings={confirmSettings}
                  alertSettings={alertSettings}
                />
              }
              else {
                return <Redirect to={'/adminaccount'} />
              }
            }
            }
          </Route>
          <Route path='/' exact>
            {() => {
              if (username === '') {
                return <Redirect to={'/login'} />
              }
              else if (userType !== 'admin') {
                return <Redirect to={'/schedules'} />
              }
              else {
                return <Redirect to={'/adminaccount'} />
              }
            }
            }
          </Route>
          <Route path='/notexist'>
            <NotExistPage />
          </Route>
          <Route >
            <NotExistPage />
          </Route>
        </Switch>
      </div>
    </Router >
  )
}

export default App;
