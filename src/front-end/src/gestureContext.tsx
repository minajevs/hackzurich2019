import * as React from 'react'
import createStoreContext from 'react-concise-state'

type Gesture = {
    desc: string,
    id: number
}

const [context, Provider] = createStoreContext({
    gestures: [
        {
            id: 0,
            desc: "Wheel + ⟶"
        },
        {
            id: 1,
            desc: "Wheel + ⟵"
        },
        {
            id: 2,
            desc: "Wheel + ↑"
        },
        {
            id: 3,
            desc: "Wheel + ↓"
        },
    ] as Gesture[]
}, ({ state, setState }) => ({
}))

export { context, Provider }
