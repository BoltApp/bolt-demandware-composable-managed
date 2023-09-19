import React, {useEffect, useRef, useState} from 'react'
import PropTypes from 'prop-types'
import useNavigation from '@salesforce/retail-react-app/app/hooks/use-navigation'
import {useCurrentBasket} from '@salesforce/retail-react-app/app/hooks/use-current-basket'
import {useAccessToken, useShopperBasketsMutation, useShippingMethodsForShipment} from '@salesforce/commerce-sdk-react'

const BoltButtonPDP = ({boltConfig, pos}) => {
    const {data: basket} = useCurrentBasket()
    const {getTokenWhenReady} = useAccessToken()
    const navigate = useNavigation()
    const boltButtonRef = useRef(null)
    const [boltButtonApp, setBoltButtonApp] = useState(false)
    const boltButtonClass = pos == 'mobile' ? 'flexible' : 'large-width'

    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }

    /******************* Shipping Methods for basket shipment *******************/
    // do this action only if the basket shipping method is not defined
    // we need to fetch the shippment methods to get the default value before we can add it to the basket
    const updateShippingMethodForShipmentsMutation = useShopperBasketsMutation(
        'updateShippingMethodForShipment'
    )

    useShippingMethodsForShipment(
        {
            parameters: {
                basketId: basket?.basketId,
                shipmentId: 'me'
            }
        },
        {
            // only fetch if basket is has no shipping method in the first shipment
            enabled:
                !!basket?.basketId &&
                basket.shipments.length > 0 &&
                !basket.shipments[0].shippingMethod,
            onSuccess: (data) => {
                updateShippingMethodForShipmentsMutation.mutate({
                    parameters: {
                        basketId: basket?.basketId,
                        shipmentId: 'me'
                    },
                    body: {
                        id: data.defaultShippingMethodId
                    }
                })
            }
        }
    )

    useEffect(() => {
        let intervalCount = 0
        async function initBoltButton() {
            var sfccData
            let callbacks = {
                close: function () {
                    if (sfccData) {
                        navigate(`/checkout/confirmation/${sfccData.merchant_order_number}`)
                    } else {
                        const boltBtns = document.querySelectorAll(
                          "div.bolt-checkout-button > div"
                        );
                        boltBtns.forEach((boltBtn) => {
                          boltBtn.style.removeProperty("display");
                        });
                      }
                },
                onCheckoutStart: function () {
                    // This function is called after the checkout form is presented to the user.
                    timeout(1000)
                        .then(() => {
                            document.getElementById("bolt-checkout-frame").focus()
                            const boltBtns = document.querySelectorAll(
                                "div.bolt-checkout-button > div"
                              );
                              boltBtns.forEach((boltBtn) => {
                                boltBtn.style.setProperty("display", "none", "important");
                              });
                        })
                        .catch((error) => {
                        // if you have an error
                        });
                },

                // eslint-disable-next-line no-unused-vars
                onEmailEnter: function (email) {
                    // This function is called after the user enters their email address.
                },

                onShippingDetailsComplete: function () {
                    // This function is called when the user proceeds to the shipping options page.
                    // This is applicable only to multi-step checkout.
                },

                onShippingOptionsComplete: function () {
                    // This function is called when the user proceeds to the payment details page.
                    // This is applicable only to multi-step checkout.
                },

                onPaymentSubmit: function () {
                    // This function is called after the user clicks the pay button.
                },
                success: function (transaction, callback) {
                    // This function is called when the Bolt checkout transaction is successful.
                    sfccData = transaction
                    callback()
                }
            }

            const cart = {
                id: basket.basketId
            }

            const jwtToken = await getTokenWhenReady()
            const hints = {
                fetch_cart_metadata: {
                    SFCCJWT: 'Bearer ' + jwtToken,
                }
            }

            try {
                window.BoltCheckout.configure(cart, hints, callbacks)
            } catch (error) {
                setBoltButtonApp(false)
            }
        }
        const intervalId = setInterval(() => {
            if (boltButtonApp) {
                clearInterval(intervalId)
            }
            if (intervalCount > 100) {
                // to cancel the interval after 10 seconds
                clearInterval(intervalId)
            } else if (
                !boltButtonApp &&
                boltButtonRef.current &&
                boltButtonRef.current.contains(
                    document.querySelector('div.bolt-checkout-button > div')
                ) &&
                window?.BoltCheckout
            ) {
                setBoltButtonApp(true)
                initBoltButton()
                clearInterval(intervalId)
            }
            intervalCount++
        }, 100)
        return () => {
            clearInterval(intervalId)
        }
    }, [boltConfig])

    return (
        <>
            {boltConfig && boltConfig?.boltMultiPublishableKey && (  
                <div>
                    <div
                        className={'bolt-checkout-button with-cards ' + boltButtonClass}
                        data-cart-total=""
                        data-tid="instant-bolt-checkout-button"
                        ref={boltButtonRef}
                    >
                        <object
                            data={
                                boltConfig.boltCdnUrl +
                                '/v1/checkout_button?publishable_key=' +
                                boltConfig.boltMultiPublishableKey
                            }
                        ></object>
                    </div>
                </div>
            )}
        </>
    )
}

BoltButtonPDP.displayName = 'BoltButtonPDP'

BoltButtonPDP.propTypes = {
    boltConfig: PropTypes.object,
    pos: PropTypes.string
}

export default BoltButtonPDP
