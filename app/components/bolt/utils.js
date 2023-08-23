import { getAppOrigin } from 'pwa-kit-react-sdk/utils/url'
import { HTTPError } from 'pwa-kit-react-sdk/ssr/universal/errors'
import fetch from 'cross-fetch'

const toCamel = (str) => {
    if (str.startsWith('_') || str.startsWith('c_')) {
        return str
    }
    return str.replace(/([-_][a-z])/gi, ($1) => {
        return $1.toUpperCase().replace('-', '').replace('_', '')
    })
}

const isObject = (obj) => {
    return obj === Object(obj) && !Array.isArray(obj) && typeof obj !== 'function'
}

export const keysToCamel = (obj) => {
    if (isObject(obj)) {
        const n = {}

        Object.keys(obj).forEach((k) => {
            n[toCamel(k)] = keysToCamel(obj[k])
        })

        return n
    } else if (Array.isArray(obj)) {
        return obj.map((i) => {
            return keysToCamel(i)
        })
    }

    return obj
}

// This function coverts errors/faults returned from the OCAPI API to the format that is returned from the CAPI
// I added the fault key to make life easier as it's hard to discern a CAPI error
export const convertOcapiFaultToCapiError = (error) => {
    return {
        title: error.message,
        type: error.type,
        detail: error.message,
        // Unique to OCAPI I think
        arguments: error.arguments,
        fault: true
    }
}

// This function is used to interact with the controller
export const createControllerFetch =
    (commerceAPIConfig) => async (endpoint, method, cache = 'no-cache', expiry = 5 * 60, body = null) => {
        const proxy = `/mobify/proxy/ocapi`
        const siteId = commerceAPIConfig.parameters.siteId
        const LOCAL_STORAGE_PREFIX = `pwa-kit-bolt-${siteId}`
        const host = `${getAppOrigin()}${proxy}`

        // logger( url, expiry, options);
        // Use the URL as the cache key to sessionStorage
        let cacheKey = `${LOCAL_STORAGE_PREFIX}-${endpoint}`
        if (cache === 'force-cache') {
            let cached = window.localStorage.getItem(cacheKey)
            let whenCached = window.localStorage.getItem(cacheKey + ':ts')
            if (cached !== null && whenCached !== null) {
                // it was in sessionStorage! Yay!
                // Even though 'whenCached' is a string, this operation
                // works because the minus sign converts the
                // string to an integer and it will work.
                let age = (Date.now() - whenCached) / 1000
                if (age < expiry) {
                    /*let response = new Response(JSON.parse(cached))
                    response.headers.set("Content-Type", "application/json; charset=utf-8")
                    return Promise.resolve(response)*/
                    return JSON.parse(cached)
                } else {
                    // We need to clean up this old key
                    localStorage.removeItem(cacheKey)
                    localStorage.removeItem(cacheKey + ':ts')
                }
            }
        }

        const headers = {
            'Content-Type': 'application/json',
            'x-dw-client-id': commerceAPIConfig.parameters.clientId
        }

        let response
        response = await fetch(`${host}/on/demandware.store/Sites-${siteId}-Site/en_US/${endpoint}`, {
            method: method,
            headers: headers,
            cache: cache,
            ...(body && {
                body: JSON.stringify(body)
            })
        })
        const httpStatus = response.status

        if (response.json) {
            response = await response.json()
        }

        const convertedResponse = response
        if (convertedResponse.fault) {
            const error = convertOcapiFaultToCapiError(convertedResponse.fault)
            throw new HTTPError(httpStatus, error.detail)
        } else {
            if (cache === 'force-cache') {
                localStorage.setItem(cacheKey, JSON.stringify(convertedResponse))
                localStorage.setItem(cacheKey + ':ts', Date.now())
            }
            return convertedResponse
        }
    }
