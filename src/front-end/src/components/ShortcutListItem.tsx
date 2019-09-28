import * as React from 'react'
import { makeStyles } from '@material-ui/styles'

import { Link, ListItem, ListItemAvatar, ListItemText, Chip, Avatar, ListItemSecondaryAction, Button, Typography } from '@material-ui/core'

import { context } from '../modalContext'
import { Combo, context as dataContext } from '../dataContext'
import { context as gestureContext } from '../gestureContext'

type Props = {
    combo: Combo
}

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
    btn: {
        color: '#63c0f5',
        textShadow: '0 0 5px rgba(104,182,255,0.5)',
        fontSize: '20px',
        textDecorationLine: 'underline',
        textDecorationColor: '#63c0f5',
        cursor: 'pointer'
    },
    puzir: {
        backgroundColor: '#b5e853',
        color: '#333'
    },
    puzir2: {
        backgroundColor: '#eaeaea',
        color: '#333'
    }
})

const ShortcutListItem: React.FC<Props> = ({ combo }) => {
    const classes = useStyles()
    const modalStore = React.useContext(context)
    const dataStore = React.useContext(dataContext)
    const gestureStore = React.useContext(gestureContext)
    const isBind = combo.gesture !== null && combo.gesture !== undefined && combo.gesture !== ''

    const handleClick = React.useCallback(() => {
        if (!isBind) modalStore.open(combo.keys)
        else {
            dataStore.unbindGesture(combo.keys)
            gestureStore.unbindGesture(combo.gesture!)
        }
    }, [combo])
    console.log(combo.keys.split(',').map(comboToKeys))
    const comboText = combo.keys.split(',').map(comboToKeys)
    const comboChips = comboText.map((rev, i) => (<>
        <Chip size="small" label={rev} className={classes.puzir} />
        {i + 1 < comboText.length
            ? <Typography style={{ display: 'inline-block', color: '#eaeaea', margin: '5px 5px' }}>   ⟶   </Typography>
            : null
        }
    </>))
    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar className={classes.puzir}>{combo.countPressed}</Avatar>
            </ListItemAvatar>
            <ListItemText>
                {comboChips}
            </ListItemText>
            <ListItemSecondaryAction>
                <Link className={classes.btn} onClick={handleClick}>
                    {isBind ? "Unbind" : "Bind"}
                </Link>
            </ListItemSecondaryAction>
        </ListItem>
    )
}

export default ShortcutListItem