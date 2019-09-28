import * as React from 'react'
import createStoreContext from 'react-concise-state'

const [context, Provider] = createStoreContext({
    currentCombo: null as string | null
}, ({ state, setState }) => ({
    open: (combo: string) => setState(prev => ({ ...prev, currentCombo: combo })),
    close: () => setState(prev => ({ ...prev, currentCombo: null })),
}))

export { context, Provider }
