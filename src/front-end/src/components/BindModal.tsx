import * as React from 'react'
import { makeStyles } from '@material-ui/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import Paper from '@material-ui/core/Paper'

import { context } from '../modalContext'
import { context as dataContext } from '../dataContext'
import { context as gestureContext } from '../gestureContext'
import { Typography, Chip, ButtonGroup, Button, FormControl, InputLabel, Select, MenuItem, Box, Link } from '@material-ui/core'

const KEY_CODES = {
    CONTROL: { code: 29, value: 'control' },
    SHIFT: { code: 42, value: 'shift' },
    OPEN_SQ_BRACKET: { code: 26, value: '[' },
    L: { code: 23, value: 'l' },
    X: { code: 45, value: 'x' },
};

const SHORTCUTS = {
    FOLD: [KEY_CODES.CONTROL, KEY_CODES.SHIFT, KEY_CODES.OPEN_SQ_BRACKET],
    SELECT_LINE: [KEY_CODES.CONTROL, KEY_CODES.L],
    CUT_LINE: [KEY_CODES.CONTROL, KEY_CODES.X],
};

const comboToKeys = (combo: string) => {
    const shortcut = SHORTCUTS[combo as keyof typeof SHORTCUTS]
    const keys = shortcut.map(x => x.value)
    return keys.reduce((prev, cur) => `${prev}+${cur}`)
}

const useStyles = makeStyles({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        backgroundColor: '#eaeaea',
        border: '1px dashed #b5e853',
        padding: '20px'
    },
    title: {
        color: '#666'
    },
    btnGroup: {
        color: '#63c0f5',
        textShadow: '0 0 5px rgba(104,182,255,0.5)',
        fontSize: '20px',
        fontFamily: 'Monaco, "Bitstream Vera Sans Mono", "Lucida Console", Terminal, monospace',
        textDecorationLine: 'underline',
        textDecorationColor: '#63c0f5',
        cursor: 'pointer',
        marginTop: '25px',
        textAlign: 'center'
    },
    formControl: {
        minWidth: 120
    },
    puzir2: {
        backgroundColor: '#eaeaea',
        color: '#333'
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

    const comboText = currentCombo && currentCombo.split(',').map(comboToKeys)
    const comboChips = comboText && comboText.map((rev, i) => (<>
        <Chip size="small" label={rev} className={classes.puzir2} />
        {i + 1 < comboText.length
            ? <Typography style={{ display: 'inline-block', color: '#eaeaea', margin: '5px 5px' }}>   ⟶   </Typography>
            : null
        }
    </>))

    return (
        <Modal
            className={classes.modal}
            open={store.currentCombo !== null}
            onClose={store.close}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
            id="modal"
        >
            <Fade in={store.currentCombo !== null}>
                <Box className={classes.box}>
                    <Typography variant="h4" component="h1" className={classes.title} gutterBottom>
                        Bind combo to:
                    </Typography>
                    <FormControl className={classes.formControl} fullWidth>
                        <InputLabel>Gesture</InputLabel>
                        <Select
                            value={selectedGesture}
                            onChange={handleChange}
                        >{gestureStore.gestures.filter(x => !x.bindTo).map(x => <MenuItem value={x.direction}>{x.description}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <br />
                    <Box className={classes.btnGroup}>
                        <Link onClick={store.close} style={{ margin: '10px' }}>Cancel</Link>
                        <Link onClick={save} style={{ margin: '10px' }}>Save</Link>
                    </Box>
                </Box>
            </Fade>
        </Modal >)
}

export default BindModal