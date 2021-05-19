import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
const NotExistPage = (props) => {
    const history = useHistory()
    const [time, setTime] = useState(5)

    const handleCountDown = () => {
        setTimeout(() => {
            setTime(time - 1)
        }, 1000);
    }
    handleCountDown()
    if (time !== 0) {
        return (
            <div>
                <h2>Oops! Nothing here.</h2>
                <p>Redirecting in {time} seconds.</p>
            </div>
        )
    }
    else {
        history.push('/login')
        return (
            <div>
                <h2>Oops! Nothing here.</h2>
            </div>
        )
    }
}

export default NotExistPage