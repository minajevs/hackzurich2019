import * as React from 'react'
import createStoreContext from 'react-concise-state'

export type Combo = {
    keys: string,
    countPressed: number,
    lastUsage: string | null,
    gesture: number | null
}

type Combos = {
    [key: string]: Combo
}

const [context, Provider] = createStoreContext({
    combos: {} as Combos
}, ({ state, setState }) => ({
    addEvent: (key: string) =>
        setState(prev => {
            const combo: Combo = prev.combos[key] || { combo: key, count: 0, lastUsage: 'now', gesture: null }
            return { ...prev, combos: { ...prev.combos, [key]: { ...combo, count: ++combo.countPressed } } }
        }),
    bindGesture: (key: string, gesture: number) => {
        setState(prev => {
            const combo: Combo = prev.combos[key]
            return { ...prev, combos: { ...prev.combos, [key]: { ...combo, gesture } } }
        })
    },
    unbindGesture: (key: string) => {
        setState(prev => {
            const combo: Combo = prev.combos[key]
            return { ...prev, combos: { ...prev.combos, [key]: { ...combo, gesture: null } } }
        })
    }
}))

export { context, Provider }
