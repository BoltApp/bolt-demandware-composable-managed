import {createControllerFetch} from './utils'
import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'

class ControllerBolt {
    constructor() {
        const {app: appConfig} = getConfig()
        this.fetch = createControllerFetch(appConfig.commerceAPI)
    }

    async getCartSession() {
        return await this.fetch('Bolt-GetCartSessionPwa', 'GET')
    }

    async getBoltConfig() {
        return await this.fetch('Bolt-GetBoltConfigPwa', 'GET', 'force-cache')
    }

    async getDefaultShipmethod() {
        return await this.fetch('Bolt-GetDefaultShipPwa', 'GET')
    }
}

export default ControllerBolt
