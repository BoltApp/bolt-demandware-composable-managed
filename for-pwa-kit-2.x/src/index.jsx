import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import BoltHeader from './bolt-header'
import BoltButton from './bolt-button'
import BoltButtonPDP from "./bolt-button-pdp";
import ControllerBolt from './controller-bolt'

const BoltCheckout = ({api, navigate, customer, basket, basketContext, boltType='cart', pos = 'normal'}) => {
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
                api={api} navigate={navigate} customer={customer} basket={basket} basketContext={basketContext} boltConfig={boltConfig}
            />}
            {boltConfig && boltConfig?.boltMultiPublishableKey && boltType == 'pdp' && <BoltButtonPDP
                api={api} navigate={navigate} customer={customer} basket={basket} basketContext={basketContext} boltConfig={boltConfig} pos={pos}
            />}
        </>
    )
}

BoltCheckout.displayName = 'BoltCheckout'

BoltCheckout.propTypes = {
    api: PropTypes.object,
    navigate: PropTypes.func,
    customer: PropTypes.object,
    basket: PropTypes.object,
    basketContext: PropTypes.object,
    boltType: PropTypes.string,
    pos: PropTypes.string
}

export default BoltCheckout
