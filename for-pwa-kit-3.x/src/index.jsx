import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import BoltHeader from './bolt-header'
import BoltButton from './bolt-button'
import ControllerBolt from './controller-bolt'
import BoltButtonPDP from "./bolt-button-pdp";

const BoltCheckout = ({basket, navigate, boltType='cart', pos = 'normal'}) => {
    const controller = new ControllerBolt()
    const [boltConfig, setBoltConfig] = useState(null)

    useEffect(() => {
        let active = true
        load()
        return () => { active = false }

        async function load() {
            const boltConfigData = await controller.getBoltConfig()
            console.log('await boltConfigData')
            if (boltConfigData?.config) {
                setBoltConfig(boltConfigData.config)
                console.log('set boltConfigData')
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
                basket={basket} navigate={navigate} boltConfig={boltConfig}
            />}
            {boltConfig && boltConfig?.boltMultiPublishableKey && boltType == 'pdp' && <BoltButtonPDP
                basket={basket} navigate={navigate} boltConfig={boltConfig} pos={pos}
            />}
        </>
    )
}

BoltCheckout.displayName = 'BoltCheckout'

BoltCheckout.propTypes = {
    basket: PropTypes.object.isRequired,
    navigate: PropTypes.func.isRequired,
    boltType: PropTypes.string,
    pos: PropTypes.string
}

export default BoltCheckout
