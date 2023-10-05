import React, { useEffect, useRef, useState, useContext } from "react";
import PropTypes from 'prop-types'
import useNavigation from "../../hooks/use-navigation";
import { useCommerceAPI, BasketContext } from "../../commerce-api/contexts";
import useCustomer from "../../commerce-api/hooks/useCustomer";
import useBoltCart from "./use-bolt-cart";
import useBasket from "../../commerce-api/hooks/useBasket";

const BoltButtonPDP = ({boltConfig, pos}) => {
  const api = useCommerceAPI();
  const boltCart = useBoltCart();
  const customer = useCustomer();
  const navigate = useNavigation();
  const boltButtonRef = useRef(null);
  const [boltButtonApp, setBoltButtonApp] = useState(false);
  const { basket, setBasket: _setBasket } = useContext(BasketContext);
  const basketHook = useBasket();
  const boltButtonClass = pos == "mobile" ? "flexible" : "large-width";

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
          const boltBtns = document.querySelectorAll(
            "div.bolt-checkout-button > div"
          );
          boltBtns.forEach((boltBtn) => {
            boltBtn.style.setProperty("display", "none", "important");
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
          await basketHook.setShippingMethod(result.shipid);
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
          document.querySelector("div.bolt-checkout-button > div")
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
            className={"bolt-checkout-button with-cards " + boltButtonClass}
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

BoltButtonPDP.displayName = 'BoltButtonPDP'

BoltButtonPDP.propTypes = {
    boltConfig: PropTypes.object,
    pos: PropTypes.string
}

export default BoltButtonPDP
