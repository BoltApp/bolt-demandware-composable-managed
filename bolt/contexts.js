import React, { createContext, useReducer } from 'react'

const BoltConfigInitialValue = {
    boltconfig: null
}

export const BoltConfigContext = createContext(BoltConfigInitialValue)

export const BoltConfigProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, { type, payload }) => {
        switch (type) {
            case 'add': {
                const { config } = payload
                state.boltconfig = config
                return {
                    ...state,
                    boltconfig: config
                }
            }
            case 'reset': {
                return { ...BoltConfigInitialValue }
            }
            default: {
                throw new Error(`Unhandled action type: ${type}`)
            }
        }
    }, BoltConfigInitialValue)
    const actions = {
        add: (config) => dispatch({ type: 'add', payload: config }),
        reset: () => dispatch({ type: 'reset' })
    }
    return (
        <BoltConfigContext.Provider value={{ state, actions }}>
            {children}
        </BoltConfigContext.Provider>
    )
}
