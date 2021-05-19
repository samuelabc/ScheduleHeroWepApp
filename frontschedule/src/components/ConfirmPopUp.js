import React, { useImperativeHandle, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const ConfirmPopUp = React.forwardRef((props, ref) => {
    const title = props.title
    const description = props.description
    const upperHandleConfirm = props.upperHandleConfirm
    const upperHandleCancel = props.upperHandleCancel
    const confirmProps = props.confirmProps
    const [open, setOpen] = React.useState(false);
    console.log('confirm props', props)
    const handleCancel = () => {
        console.log('title', title)
        setOpen(false)
        if (upperHandleCancel) {
            upperHandleCancel()
        }
    }
    const handleConfirm = () => {
        console.log('upperHandleConfirm', upperHandleConfirm)
        console.log('confirmProps', confirmProps)
        setOpen(false)
        upperHandleConfirm(confirmProps)
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
                    Cancel
                    </Button>
                <Button onClick={handleConfirm} color="primary" autoFocus>
                    Confirm
                    </Button>
            </DialogActions>
        </Dialog>
    );
})
export default ConfirmPopUp