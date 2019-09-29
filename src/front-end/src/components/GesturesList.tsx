import * as React from 'react'
import { context } from '../gestureContext'
import { makeStyles } from '@material-ui/styles'

import { List, ListItem, ListItemAvatar, ListItemText, Divider, Avatar, Chip, Typography, Button } from '@material-ui/core'

const useStyles = makeStyles({
    puzir: {
        backgroundColor: '#b5e853',
        color: '#333'
    },
    puzir2: {
        backgroundColor: '#eaeaea',
        color: '#333'
    }
})

const GesturesList: React.FC = () => {
    const store = React.useContext(context)
    const { gestures } = store
    const classes = useStyles()

    React.useEffect(() => {
        store.init()
    }, [])

    return (<>
        <List>
            {gestures.map(x => (<>
                <ListItem key={x.direction}>
                    <ListItemText>
                        <Chip label={x.description} className={x.bindTo ? classes.puzir : classes.puzir2} />
                    </ListItemText>
                </ListItem>
            </>
            ))}
        </List>
    </>
    )
}

export default GesturesList