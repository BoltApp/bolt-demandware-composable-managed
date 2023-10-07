import React, { useEffect, useRef, useState, useContext } from "react";
import PropTypes from 'prop-types'
import useBoltCart from "./use-bolt-cart";

const BoltButton = ({api, navigate, customer, basket, basketContext, boltConfig, ...props}) => {
  const boltCart = useBoltCart();
  const boltButtonRef = useRef(null);
  const [boltButtonApp, setBoltButtonApp] = useState(false);
  const { setBasket: _setBasket } = useContext(basketContext);

  const setSfccData = async (orderNo) => {
    try {
      let order = await customer.getOrder(orderNo);
      return order;
    } catch (error) {}
  };

  const setBasket = (basketData) => {
    const _productItemsDetail = basket?._productItemsDetail;
    _setBasket({ _productItemsDetail, ...basketData });
  };

  useEffect(() => {
    let intervalCount = 0;
    async function initBoltButton() {
      var sfccData;
      let callbacks = {
        close: function () {
          if (sfccData) {
            setBasket(sfccData);
            navigate("/checkout/confirmation");
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
          setSfccData(transaction.merchant_order_number)
            .then((result) => {
              sfccData = result;
              callback();
            })
            .catch((error) => {
              // if you have an error
            });
        },
      };

      if (
        basket.basketId &&
        basket.shipments.length > 0 &&
        !basket.shipments[0].shippingMethod
      ) {
        var result = await boltCart.getDefaultShipmethod();
        if (result?.shipid) {
          await basket.setShippingMethod(result.shipid);
        }
      }

      const cart = {
        id: basket.basketId,
      };
      const jwtToken = api.auth.authToken;
      const hints = {
        fetch_cart_metadata: {
          SFCCJWT: jwtToken,
        },
      };

      try {
        window.BoltCheckout.configure(cart, hints, callbacks);
      } catch (error) {
        setBoltButtonApp(false);
      }
    }
    const intervalId = setInterval(() => {
      if (boltButtonApp) {
        clearInterval(intervalId);
      }
      if (intervalCount > 100) {
        // to cancel the interval after 10 seconds
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
          <div
            className="bolt-cart-button"
            data-cart-total=""
            data-tid="instant-bolt-checkout-button"
            ref={boltButtonRef}
          >
            <object
              data={
                boltConfig.boltCdnUrl +
                "/v1/checkout_button?publishable_key=" +
                boltConfig.boltMultiPublishableKey
              }
            ></object>
          </div>
        </div>
      )}
    </>
  );
};

BoltButton.displayName = 'BoltButton'

BoltButton.propTypes = {
    api: PropTypes.object,
    navigate: PropTypes.func,
    customer: PropTypes.object,
    basket: PropTypes.object,
    basketContext: PropTypes.object,
    boltType: PropTypes.string
}

export default BoltButton
