import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import BoltHeader from '@salesforce/retail-react-app/app/components/bolt/bolt-header'
import BoltButton from '@salesforce/retail-react-app/app/components/bolt/bolt-button'
import ControllerBolt from '@salesforce/retail-react-app/app/components/bolt/controller-bolt'
import BoltButtonPDP from "@salesforce/retail-react-app/app/components/bolt/bolt-button-pdp";

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
