import * as React from 'react'
import { context } from '../gestureContext'
import { makeStyles } from '@material-ui/styles'

import { List, ListItem, ListItemAvatar, ListItemText, Divider, Avatar, Chip, Typography, Button } from '@material-ui/core'

const useStyles = makeStyles({
    list: {

    },
})

const DeviceList: React.FC = () => {
    const store = React.useContext(context)

    if (store.loading) return <Typography>Loading devices</Typography>
    if (store.devices === null || store.devices.length === 0) return (<>
        <Typography>Devices not found</Typography>
        <Button onClick={store.loadDevices}>Reload</Button>
    </>)

    return (<>
        {store.devices.map((x, id) =>
            <Typography key={id}>{`[${x.type}] ${x.name}`}</Typography>
        )}
        <Typography>{`[tap] ${store.tap}`}</Typography>
        <Typography>{`[begin] x: ${store.begin && store.begin.x} y: ${store.begin && store.begin.y}`}</Typography>
        <Typography>{`[end] x: ${store.end && store.end.x} y: ${store.end && store.end.y}`}</Typography>
        <Typography>{`[direction] ${store.swipe}`}</Typography>
        <Button onClick={store.loadDevices}>Reload</Button>
    </>)
}

const GesturesList: React.FC = () => {
    const store = React.useContext(context)
    const { gestures } = store
    const classes = useStyles()

    React.useEffect(() => {
        store.init()
    }, [])

    return (<>
        <DeviceList />
        <List className={classes.list}>
            {gestures.map(x => (<>
                <ListItem key={x.desc}>
                    <ListItemText>
                        <Chip size="small" label={x.desc} color="secondary" />
                    </ListItemText>
                </ListItem>
            </>
            ))}
        </List>
    </>
    )
}

export default GesturesList