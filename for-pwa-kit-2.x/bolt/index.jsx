import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import BoltHeader from './bolt-header'
import BoltButton from './bolt-button'
import BoltButtonPDP from "./bolt-button-pdp";
import ControllerBolt from './controller-bolt'

const BoltCheckout = ({boltType='cart', pos = 'normal'}) => {
    const controller = new ControllerBolt()
    const [boltConfig, setBoltConfig] = useState(null)

    useEffect(() => {
        let active = true
        load()
        return () => { active = false }

        async function load() {
            const boltConfigData = await controller.getBoltConfig()
            if (boltConfigData?.config) {
                setBoltConfig(boltConfigData.config)
            }
            if (!active) { return }            
        }
    }, [])

    return (
        <>
            {boltConfig && boltConfig?.boltMultiPublishableKey && <BoltHeader 
                boltConfig={boltConfig}
            />}
            {boltConfig && boltConfig?.boltMultiPublishableKey && boltType == 'cart' && <BoltButton
                boltConfig={boltConfig}
            />}
            {boltConfig && boltConfig?.boltMultiPublishableKey && boltType == 'pdp' && <BoltButtonPDP
                boltConfig={boltConfig} pos={pos}
            />}
        </>
    )
}

BoltCheckout.displayName = 'BoltCheckout'

BoltCheckout.propTypes = {
    boltType: PropTypes.string,
    pos: PropTypes.string
}

export default BoltCheckout
