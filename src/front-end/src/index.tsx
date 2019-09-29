import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import './index.css'

import { createMuiTheme } from '@material-ui/core/styles'

import { Provider } from './dataContext'
import { Provider as ModalProvider } from './modalContext'
import { Provider as GestureProvider } from './gestureContext'
import { ThemeProvider } from '@material-ui/styles'

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Monaco, "Bitstream Vera Sans Mono", "Lucida Console", Terminal, monospace',
        fontWeightRegular: 'bolder'
    },
});


const Main = <GestureProvider>
    <ModalProvider>
        <Provider>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </Provider>
    </ModalProvider>
</GestureProvider>

ReactDOM.render(Main, document.getElementById('root'));

serviceWorker.unregister();
