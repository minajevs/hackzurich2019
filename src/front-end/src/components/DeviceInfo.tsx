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
    },
    dot1: {
        height: '12px',
        width: '12px',
        background: 'linear-gradient(135deg, rgba(78,171,3,1) 0%, rgba(64,141,2,1) 44%, rgba(48,107,0,1) 51%, rgba(48,107,0,1) 100%)',
        borderRadius: '50%',
        display: 'inline-block',
        marginRight: '5px'
    },
    dot2: {
        height: '12px',
        width: '12px',
        background: 'linear-gradient(135deg, rgba(246,32,4,1) 0%, rgba(201,26,3,1) 44%, rgba(153,18,0,1) 51%, rgba(153,18,0,1) 100%)',
        borderRadius: '50%',
        display: 'inline-block',
        marginRight: '5px'
    },
})

const DeviceList: React.FC = () => {
    const store = React.useContext(context)
    const classes = useStyles()

    React.useEffect(() => {
        store.loadDevices()
    }, [])
    if (store.loading) return <Typography>Loading devices</Typography>

    const con = <Avatar>+</Avatar>
    const notcon = <Avatar>-</Avatar>


    const mouseConnected = store.devices && store.devices.find(x => x.type === 'mouse') && store.devices.find(x => x.type === 'mouse')!.isConnected
    const keyboardConnected = store.devices && store.devices.find(x => x.type === 'keyboard') && store.devices.find(x => x.type === 'keyboard')!.isConnected

    return (<>
        <Typography style={{ color: '#eaeaea' }}>
            <span className={mouseConnected ? classes.dot1 : classes.dot2} />
            MX Master3 Mouse
        </Typography>
        <Typography style={{ color: '#eaeaea' }}>
            <span className={keyboardConnected ? classes.dot1 : classes.dot2} />
            MX Keys Keyboard
        </Typography>
        <Typography>{`[direction] ${store.swipe}`}</Typography>
    </>)
}

export default DeviceList