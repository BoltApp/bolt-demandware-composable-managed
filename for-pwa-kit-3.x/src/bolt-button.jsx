import React, { useEffect, useRef, useState, useContext } from "react";
import PropTypes from 'prop-types'
//import useNavigation from '@salesforce/retail-react-app/app/hooks/use-navigation'
//import {useCurrentBasket} from '@salesforce/retail-react-app/app/hooks/use-current-basket'
import {useAccessToken} from '@salesforce/commerce-sdk-react'
/*

<div>
          <div
            data-tid="instant-bolt-checkout-button"
            className="bolt-checkout-button"
            ref={boltButtonRef}
          >
            <script
              id="bolt-connect"
              type="text/javascript"
              src="https://connect.ning.dev.bolt.me"
              data-publishable-key={boltConfig.boltMultiPublishableKey}
            ></script>
          </div>
        </div>

        <div>
          <div className="bolt-cart-button" data-cart-total="" data-tid="instant-bolt-checkout-button" ref={boltButtonRef}>
              <object data={boltConfig.boltCdnUrl + "/v1/checkout_button?publishable_key=" + boltConfig.boltMultiPublishableKey}></object>
          </div>
        </div>

*/
const BoltButton = ({basket, navigate, boltConfig}) => {

  const {getTokenWhenReady} = useAccessToken()

  const boltButtonRef = useRef(null);
  const [boltButtonApp, setBoltButtonApp] = useState(false);

  useEffect(() => {
    console.log("render BoltButton1");
    let intervalCount = 0;
    async function initBoltButton() {
      console.log("start initBoltButton");
      var sfccData;
      let callbacks = {
        close: function () {
          if (sfccData) {
            navigate(`/checkout/confirmation/${sfccData.merchant_order_number}`)
          }
        },
        onCheckoutStart: function () {
          // This function is called after the checkout form is presented to the user.
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
          sfccData = transaction;
          callback();
        },
      };
      // var result = await boltCart.getCartSession();
      // if (result?.hints) {
      const cart = {
        id: basket.basketId,
      };
      const jwtToken = await getTokenWhenReady()
      const hints = {
        fetch_cart_metadata: {
          SFCCJWT: 'Bearer ' + jwtToken,
        },
      };
      // const hints = {};
      // result.hints = {};
      // console.log(JSON.stringify(hints));
      try {
        window.BoltCheckout.configure(cart, hints, callbacks);
      } catch (error) {
        setBoltButtonApp(false);
        console.log("Bolt Button configured error");
      }

      console.log("Bolt Button configured");
      // }
    }
    const intervalId = setInterval(() => {
      console.log("useEffect setInterval");
      if (boltButtonApp) {
        clearInterval(intervalId);
      }
      if (intervalCount > 100) {
        // to cancel the interval after 10 seconds
        console.log("useEffect setInterval - not setup");
        clearInterval(intervalId);
      } else if (
        !boltButtonApp &&
        boltButtonRef.current &&
        boltButtonRef.current.contains(
          document.querySelector("div.bolt-cart-button svg")
        ) &&
        window?.BoltCheckout
      ) {
        setBoltButtonApp(true);
        console.log("Bolt DOM fully loaded and parsed");
        initBoltButton();
        clearInterval(intervalId);
      }
      intervalCount++;
    }, 100);
    return () => {
      clearInterval(intervalId);
    };
  }, [boltConfig]);

  return (
    <>
      {boltConfig && boltConfig?.boltMultiPublishableKey && (
        <div>
          <div className="bolt-cart-button" data-cart-total="" data-tid="instant-bolt-checkout-button" ref={boltButtonRef}>
              <object data={boltConfig.boltCdnUrl + "/v1/checkout_button?publishable_key=" + boltConfig.boltMultiPublishableKey}></object>
          </div>
        </div>
      )}
    </>
  );
};

BoltButton.displayName = 'BoltButton'

BoltButton.propTypes = {
  boltConfig: PropTypes.object,
}

export default BoltButton
