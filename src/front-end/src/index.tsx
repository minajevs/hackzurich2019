import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'

import { Provider } from './dataContext'
import { Provider as ModalProvider } from './modalContext'
import { Provider as GestureProvider } from './gestureContext'

const Main = <GestureProvider>
    <ModalProvider>
        <Provider>
            <App />
        </Provider>
    </ModalProvider>
</GestureProvider>

ReactDOM.render(Main, document.getElementById('root'));

serviceWorker.unregister();
