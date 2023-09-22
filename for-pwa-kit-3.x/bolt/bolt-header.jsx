import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Helmet} from 'react-helmet'
import {defaultTags} from '@salesforce/retail-react-app/app/components/bolt/types'

const BoltHeader = ({boltConfig}) => {
    const [boltScriptTags, setBoltScriptTags] = useState(defaultTags)

    useEffect(() => {
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
