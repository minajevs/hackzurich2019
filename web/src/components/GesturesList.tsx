import * as React from 'react'
import { context } from '../gestureContext'
import { makeStyles } from '@material-ui/styles'

import { List, ListItem, ListItemAvatar, ListItemText, Divider, Avatar, Chip } from '@material-ui/core'

const useStyles = makeStyles({
    list: {
        border: '1px solid gray',
        borderRadius: '12px'
    },
})

const GesturesList: React.FC = () => {
    const store = React.useContext(context)
    const { gestures } = store
    const classes = useStyles()
    return (
        <List className={classes.list}>
            {gestures.map(x => (<>
                <ListItem>
                    <ListItemText>
                        <Chip size="small" label={x.desc} color="secondary" />
                    </ListItemText>
                </ListItem>
            </>
            ))}
        </List>
    )
}

export default GesturesList