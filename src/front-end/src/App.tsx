import React from 'react'
import { makeStyles } from '@material-ui/styles'


import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'

import ShortcutList from './components/ShortcutList'
import GesturesList from './components/GesturesList'
import BindModal from './components/BindModal'

const App: React.FC = () => {
  return (<Grid container spacing={3}>
    <Grid item xs={12}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shortcut dashboard
      </Typography>
    </Grid>
    <Grid item xs={8}>
      <ShortcutList />
    </Grid>
    <Grid item xs={4}>
      <GesturesList />
    </Grid>
    <BindModal />
  </Grid>)
}

export default App
