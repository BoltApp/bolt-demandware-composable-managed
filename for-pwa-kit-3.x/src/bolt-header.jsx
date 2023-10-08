import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Helmet} from 'react-helmet'
import {defaultTags} from './types'
/*
ssr.js
helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            'img-src': ["'self'", '*.commercecloud.salesforce.com', 'data:'],
            'script-src': ["'self'", "'unsafe-eval'", 'storage.googleapis.com'],
            'connect-src': ["'self'", 'api.cquotient.com'],

            // Do not upgrade insecure requests for local development
            'upgrade-insecure-requests': isRemote() ? [] : null
        }
    },
    // contentSecurityPolicy: false,
    hsts: isRemote()
})
To

helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            'img-src': ["'self'", '*.commercecloud.salesforce.com', 'data:'],
            'script-src': ["'self'", "'unsafe-eval'", 'storage.googleapis.com', '*.bolt.com', '*.bugsnag.com'],
            'connect-src': ["'self'", 'api.cquotient.com', '*.bolt.com', '*.bugsnag.com'],
            'frame-src': ["'self'", '*.bolt.com', '*.bugsnag.com'],
            // Do not upgrade insecure requests for local development
            'upgrade-insecure-requests': isRemote() ? [] : null
        }
    },
    hsts: isRemote()
})


*/

const BoltHeader = ({boltConfig}) => {
    const [boltScriptTags, setBoltScriptTags] = useState(defaultTags)

    useEffect(() => {
        console.log('render BoltHeader')
        if (boltConfig?.boltMultiPublishableKey) {
            let boltConfigVal = [
                {
                    id: 'bolt-connect',
                    publishableKey: boltConfig.boltMultiPublishableKey,
                    src: boltConfig.boltCdnUrl + '/connect.js'
                }
            ]
            setBoltScriptTags(boltConfigVal)
        } else {
            setBoltScriptTags(defaultTags)
        }
    }, [boltConfig])

    return (
        <Helmet>
            {boltScriptTags &&
                boltScriptTags.map((boltScriptTag) => (
                    <script
                        type="text/javascript"
                        key={boltScriptTag.id}
                        id={boltScriptTag.id}
                        data-publishable-key={boltScriptTag.publishableKey}
                        src={boltScriptTag.src}
                    ></script>
                ))}
        </Helmet>
    )
}

BoltHeader.displayName = 'BoltHeader'

BoltHeader.propTypes = {
  boltConfig: PropTypes.object,
}

export default BoltHeader
