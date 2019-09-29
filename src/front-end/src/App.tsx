import React from 'react'
import { makeStyles } from '@material-ui/styles'


import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import ShortcutList from './components/ShortcutList'
import GesturesList from './components/GesturesList'
import BindModal from './components/BindModal'
import DeviceList from './components/DeviceInfo'


const App: React.FC = () => {
  React.useEffect(() => {
    (window as any).ipcRenderer.send('zhopa')
  }, [])
  return (<Grid container spacing={3}>
    <Grid item xs={8} style={{ borderRight: "1px dashed #b5e853" }}>
      <Typography variant="h5" component="h4" gutterBottom style={{ paddingLeft: '20px' }}>
        Frequently used shortcuts
      </Typography>
      <ShortcutList />
    </Grid>
    <Grid item xs={4} style={{ padding: 0 }}>
      <Grid container>
        <Grid item xs={12} style={{ padding: '12px' }}>
          <Typography variant="h5" component="h4" gutterBottom style={{ paddingLeft: '20px' }}>
            Mouse gestures
          </Typography>
          <GesturesList />
        </Grid>
        <Grid item xs={12} style={{ borderTop: "1px dashed #b5e853", padding: '12px' }}>
          <Typography variant="h5" component="h4" gutterBottom style={{ paddingLeft: '20px' }}>
            Device Info
          </Typography>
          <DeviceList />
        </Grid>
      </Grid>

    </Grid>
    <BindModal />
  </Grid>)
}

export default App
