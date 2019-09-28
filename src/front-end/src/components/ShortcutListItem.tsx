import * as React from 'react'
import { makeStyles } from '@material-ui/styles'

import { List, ListItem, ListItemAvatar, ListItemText, Chip, Avatar, ListItemSecondaryAction, Button } from '@material-ui/core'

import { context } from '../modalContext'
import { Combo, context as dataContext } from '../dataContext'
import { context as gestureContext } from '../gestureContext'

type Props = {
    combo: Combo
}

const useStyles = makeStyles({
    btnBind: {
        background: 'linear-gradient(135deg, #c9de96 0%,#8ab66b 44%,#398235 100%)',
    },
    btnUnbind: {
        background: 'linear-gradient(135deg, #a90329 0%,#8f0222 44%,#6d0019 100%)',
    },
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

    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar>{combo.countPressed}</Avatar>
            </ListItemAvatar>
            <ListItemText>
                <Chip size="small" label={combo.keys} color="primary" />
            </ListItemText>
            <ListItemSecondaryAction>
                <Button variant="contained" className={isBind ? classes.btnUnbind : classes.btnBind} onClick={handleClick}>
                    {isBind ? "Unbind" : "Bind"}
                </Button>
            </ListItemSecondaryAction>
        </ListItem>
    )
}

export default ShortcutListItem