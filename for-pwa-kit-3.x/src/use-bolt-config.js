import { useContext, useMemo } from 'react'
import { BoltConfigContext } from './contexts'
import ControllerBolt from './controller-bolt'

export default function useBoltConfig() {
    const { state, actions } = useContext(BoltConfigContext)
    const controller = new ControllerBolt()

    const self = useMemo(() => {
        return {
            config: state.boltconfig,

            reset() {
                actions.reset()
            },

            getOrCreateConfig: async () => {
                if (state?.boltconfig) {
                    console.log('boltconfig reserved')
                    return state.boltconfig
                }
                const boltConfig = await controller.getBoltConfig()
                console.log('getOrCreateConfig')
                if (boltConfig?.config) {
                    console.log('set boltconfig')
                    actions.add(boltConfig)
                }
                return state.boltconfig
            }
        }
    }, [state])

    return self
}
