import * as React from 'react'
import { makeStyles } from '@material-ui/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import Paper from '@material-ui/core/Paper'

import { context } from '../modalContext'
import { context as dataContext } from '../dataContext'
import { Typography, Chip, ButtonGroup, Button } from '@material-ui/core'

const useStyles = makeStyles({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        padding: '10px'
    },
    btnGroup: {
        margin: "10px 100px"
    }
})

const BindModal: React.FC = () => {
    const classes = useStyles()
    const store = React.useContext(context)
    const dataStore = React.useContext(dataContext)

    const { currentCombo } = store

    const save = React.useCallback((gesture: number) => {
        dataStore.bindGesture(currentCombo || '', gesture)
        store.close()
    }, [currentCombo])

    return (
        <Modal
            className={classes.modal}
            open={store.currentCombo !== null}
            onClose={store.close}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
            <Fade in={store.currentCombo !== null}>
                <Paper>
                    <Typography variant="h4" component="h1" className={classes.title} gutterBottom>
                        Bind <Chip label={"ctrl+" + store.currentCombo} color="primary" /> combo to:
                    </Typography>
                    GESTURE SELECTOR
                    <br />
                    <ButtonGroup variant="contained" className={classes.btnGroup}>
                        <Button color="secondary" onClick={store.close}>Cancel</Button>
                        <Button color="primary" onClick={() => save(1)}>Save</Button>
                    </ButtonGroup>
                </Paper>
            </Fade>
        </Modal >)
}

export default BindModal