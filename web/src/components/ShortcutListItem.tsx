import * as React from 'react'
import { makeStyles } from '@material-ui/styles'

import { List, ListItem, ListItemAvatar, ListItemText, Chip, Avatar, ListItemSecondaryAction, Button } from '@material-ui/core'

import { context } from '../modalContext'
import { Combo, context as dataContext } from '../dataContext'

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
    const isBind = combo.gesture !== null

    const handleClick = React.useCallback(() => {
        isBind
            ? dataStore.unbindGesture(combo.combo)
            : modalStore.open(combo.combo)
    }, [combo])

    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar>{combo.count}</Avatar>
            </ListItemAvatar>
            <ListItemText>
                <Chip size="small" label={"ctrl+" + combo.combo} color="primary" />
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