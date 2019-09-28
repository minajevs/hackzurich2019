import * as React from 'react'
import { context } from '../dataContext'
import { makeStyles } from '@material-ui/styles'

import { List, ListItem, ListItemAvatar, ListItemText, Divider, Avatar, Typography } from '@material-ui/core'

import ShortcutListItem from './ShortcutListItem'

const useStyles = makeStyles({
    list: {
    },
})

const ShortcutList: React.FC = () => {
    const store = React.useContext(context)
    React.useEffect(() => {
        store.init()
        return store.deinit()
    }, [])
    const classes = useStyles()
    return (
        <List className={classes.list}>
            {store.combos.map(x => (<>
                <ShortcutListItem combo={x} />
                <Divider variant="inset" component="li" />
            </>
            ))}
            {store.combos.length === 0 ? <Typography>No actions yet</Typography> : null}
        </List>
    )
}

export default ShortcutList