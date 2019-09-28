import * as React from 'react'
import createStoreContext from 'react-concise-state'

export type Combo = {
    keys: string,
    countPressed: number,
    gesture: string | null
}

type Combos = {
    [key: string]: Combo
}

const [context, Provider] = createStoreContext({
    combos: [] as Combo[]
}, ({ state, setState }) => ({
    init: () => {
        (window as any).ipcRenderer.on('shortcuts-list', (event: any, combos: any) => {
            console.log(combos)
            setState(prev => ({ ...prev, combos }))
        })
    },
    deinit: () => {
        (window as any).ipcRenderer.removeListener('shortcuts-list', (event: any, combos: any) => setState(prev => ({ ...prev, combos })));
    },
    bindGesture: (key: string, gesture: string) => {
        setState(prev => {
            const newCombos = prev.combos.map(x => {
                if (x.keys === key) return { ...x, gesture: gesture }
                return { ...x }
            })
            return { ...prev, combos: [...newCombos] }
        })
    },
    unbindGesture: (key: string) => {
        setState(prev => {
            const newCombos = prev.combos.map(x => {
                if (x.keys === key) return { ...x, gesture: null }
                return { ...x }
            })
            return { ...prev, combos: [...newCombos] }
        })
    }
}))

export { context, Provider }
