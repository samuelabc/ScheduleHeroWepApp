import React, { useImperativeHandle, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const AlertPopUp = React.forwardRef((props, ref) => {
    const title = props.title
    const description = props.description
    const [open, setOpen] = React.useState(false);
    const handleCancel = () => {
        console.log('title', title)
        setOpen(false)
    }
    const changeVisibility = () => {
        setOpen(!open)
    }
    useImperativeHandle(ref, () => {
        return {
            changeVisibility
        }
    })
    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="secondary">
                    Okay
                </Button>
            </DialogActions>
        </Dialog>
    );
})
export default AlertPopUp