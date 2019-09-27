import * as React from 'react'
import { context } from '../dataContext'
import { makeStyles } from '@material-ui/styles'

import { List, ListItem, ListItemAvatar, ListItemText, Divider, Avatar, Typography } from '@material-ui/core'

import ShortcutListItem from './ShortcutListItem'

const useStyles = makeStyles({
    list: {
        border: '1px solid gray',
        borderRadius: '12px'
    },
})

const ShortcutList: React.FC = () => {
    const store = React.useContext(context)
    const { combos } = store
    const classes = useStyles()

    React.useEffect(() => {
        document.addEventListener('keypress', (event) => {
            const keyName = event.key
            store.addEvent(keyName)
        })
    }, [])

    const sortedCombos = Object.values(combos).sort((a, b) => b.count - a.count)

    return (
        <List className={classes.list}>
            {sortedCombos.map(x => (<>
                <ShortcutListItem combo={x} />
                <Divider variant="inset" component="li" />
            </>
            ))}
            {sortedCombos.length === 0 ? <Typography>No actions yet</Typography> : null}
        </List>
    )
}

export default ShortcutList