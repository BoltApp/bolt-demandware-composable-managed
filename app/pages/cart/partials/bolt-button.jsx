/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import {
    Button
} from '@chakra-ui/react'
import {FormattedMessage} from 'react-intl'
import { useCommerceAPI } from '../../../commerce-api/contexts'
import useBasket from '../../../commerce-api/hooks/useBasket'

const BoltButton1 = () => {
    const basket = useBasket()
    const api = useCommerceAPI()

    const handleRemoveItem = async () => {
        /*const ccnxg = localStorage.getItem('cc-nx-g')
        const promos = await basket.getSessionId(ccnxg)
        if (promos?.data) {
            console.log('basket', promos.data)
        }*/
        const response = await fetch('/mobify/proxy/ocapi/on/demandware.store/Sites-RefArch-Site/en_US/Bolt-GetOrderReference')
        const httpStatus = response.status

        if (response.json) {
            response = await response.json()
            console.log('basket', response)
        } else {
            console.log('basket', 'error')
        }
    }

    return (
        <>
            <Button variant="link" size="sm" onClick={handleRemoveItem}>
                <FormattedMessage
                    defaultMessage="Remove"
                    id="cart_secondary_button_group.action.remove"
                />
            </Button>
        </>
    )
}

export default BoltButton1
