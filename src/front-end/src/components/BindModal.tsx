import * as React from 'react'
import { makeStyles } from '@material-ui/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import Paper from '@material-ui/core/Paper'

import { context } from '../modalContext'
import { context as dataContext } from '../dataContext'
import { context as gestureContext } from '../gestureContext'
import { Typography, Chip, ButtonGroup, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'

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
    },
    formControl: {
        minWidth: 120
    }
})

const BindModal: React.FC = () => {
    const classes = useStyles()
    const store = React.useContext(context)
    const dataStore = React.useContext(dataContext)
    const gestureStore = React.useContext(gestureContext)

    const [selectedGesture, setSelected] = React.useState('')

    const { currentCombo } = store

    const handleChange = React.useCallback((event: any) => {
        setSelected(event.target.value)
        console.log(event.target.value)
    }, [currentCombo])

    const save = React.useCallback(() => {
        dataStore.bindGesture(currentCombo!, selectedGesture)
        gestureStore.bindGesture(selectedGesture, currentCombo!)
        store.close()
    }, [currentCombo, selectedGesture])

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
                    <FormControl className={classes.formControl}>
                        <InputLabel>Gesture</InputLabel>
                        <Select
                            value={selectedGesture}
                            onChange={handleChange}
                        >{gestureStore.gestures.filter(x => !x.bindTo).map(x => <MenuItem value={x.direction}>{x.description}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <br />
                    <ButtonGroup variant="contained" className={classes.btnGroup}>
                        <Button color="secondary" onClick={store.close}>Cancel</Button>
                        <Button color="primary" onClick={save}>Save</Button>
                    </ButtonGroup>
                </Paper>
            </Fade>
        </Modal >)
}

export default BindModal