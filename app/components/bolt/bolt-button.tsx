import React, { useEffect, useRef, useState, useContext } from "react";
import useNavigation from "../../hooks/use-navigation";
import { BasketContext } from "../../commerce-api/contexts";
import useCustomer from "../../commerce-api/hooks/useCustomer";
import useBoltCart from "./use-bolt-cart";

export const BoltButton = (props) => {
  const { boltConfig, ...rest } = props;

  const boltCart = useBoltCart();
  const customer = useCustomer();
  const navigate = useNavigation();
  const boltButtonRef = useRef(null);
  const [boltButtonApp, setBoltButtonApp] = useState(false);
  const { basket, setBasket: _setBasket } = useContext(BasketContext);

  const closeModal = async (orderNo) => {
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
          // sfccData = transaction;
          closeModal(transaction.merchant_order_number)
            .then((result) => {
              sfccData = result;
              callback();
            })
            .catch((error) => {
              // if have an error
            });
        },
      };
      var result = await boltCart.getCartSession();
      if (result?.hints) {
        const cart = {
          id: basket.basketId,
        };
        try {
          window.BoltCheckout.configure(cart, result?.hints, callbacks);
        } catch (error) {
          setBoltButtonApp(false);
        }
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
        /*boltButtonRef.current.contains(
          document.querySelector("div.bolt-cart-button svg")
        ) &&*/
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
      )}
    </>
  );
};
