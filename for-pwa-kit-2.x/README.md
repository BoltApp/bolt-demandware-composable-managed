## Requirements

-   Node 18.x
-   npm 9.x

Currently Managed Runtime environment only supports Node.js 18.x, for more information, please see https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/upgrade-node-version.html

## Get Started

1. Install Bolt component package, run the command below from `your_project_path`
    ```sh
    npm install @boltpay/bolt-pwa-kit2.x
    ```

2. Make sure the properties of `engines` in the `your_project_path/package.json` use correct node version

    ```sh
    "engines": {
        "node": "^18.0.0",
        "npm": "^9.0.0"
     },
    ```

3. Set Up API Access

    (1) Make sure your SLAS Client have the following settings in the `Scopes` field 

    ```sh
    sfcc.shopper-myaccount.baskets sfcc.shopper-discovery-search sfcc.shopper-myaccount.addresses sfcc.shopper-products sfcc.shopper-myaccount.rw sfcc.shopper-myaccount.paymentinstruments sfcc.custom_objects sfcc.shopper-customers.login sfcc.shopper-myaccount.orders sfcc.shopper-baskets-orders sfcc.shopper-customers.register sfcc.shopper-productlists sfcc.shopper-myaccount.addresses.rw sfcc.shopper-myaccount.productlists.rw sfcc.shopper-promotions sfcc.session_bridge sfcc.shopper-baskets-orders.rw sfcc.shopper-myaccount.paymentinstruments.rw sfcc.shopper-gift-certificates sfcc.shopper-custom_objects sfcc.shopper-product-search sfcc.shopper-myaccount.productlists sfcc.shopper-categories sfcc.shopper-myaccount
    ```

    (2) Follow [this guide](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/setting-up-api-access.html#update-open-commerce-api-settings) to Update Open Commerce API Settings

4. Complete the configuration files

    When a PWA Kit project is created with the Retail React App template, it comes with a single configuration file: `app/config/default.js`. The configuration objects that it exports are set based on the options provided to pwa-kit-create-app, but you can update your configuration at any time. Updates are often necessary after the initial project generation to stay in sync with changes to B2C Commerce instances.

    (1) Follow [this guide](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/configuration-options.html#api-access) to config API Access

    (2) Update SSR config, locate the file `your_project_path/app/ssr.js` and set HTTP security headers with bolt domain(*.bolt.com and *.bugsnag.com)

    ```javascript
      app.use(
        helmet({
          contentSecurityPolicy: {
            useDefaults: true,
            directives: {
              "img-src": [
                "'self'",
                "*.commercecloud.salesforce.com",
                "*.bolt.com",
                "data:",
              ],
              "script-src": [
                "'self'",
                "'unsafe-eval'",
                "storage.googleapis.com",
                "*.bolt.com",
                "*.bugsnag.com",
              ],
              "connect-src": [
                "'self'",
                "api.cquotient.com",
                "*.bolt.com",
                "*.bugsnag.com",
              ],
              "frame-src": [
                "'self'",
                "*.bolt.com",
                "*.bugsnag.com",
              ],
              "object-src": [
                "'self'",
                "*.bolt.com",
                "*.bugsnag.com",
              ],
              // Do not upgrade insecure requests for local development
              "upgrade-insecure-requests": isRemote() ? [] : null,
            },
          },
          hsts: isRemote(),
        })
      );
    ```
    
5. Run following command:

    ```sh
    npm install
    npm ci
    ```

6. Enable the Bolt checkout button on the cart page:

    - For the desktop mode, locate the file `your_project_path/app/pages/cart/index.jsx`
        - Import Bolt component and necessary modules
            ```javascript
            import BoltCheckout from "@boltpay/bolt-pwa-kit2.x/dist/index";
            import { useCommerceAPI, BasketContext } from "../../commerce-api/contexts";
            ```
            
        - Define constant variables within `const Cart`
            ```javascript
            const Cart = () => {
                const api = useCommerceAPI();
            ```
            
        - Replace original checkout button with the Bolt checkout button
            from 
            ```html
            <Stack spacing={4}>
                <OrderSummary showPromoCodeForm={true} isEstimate={true} />
                <Box display={{base: 'none', lg: 'block'}}>
                    <CartCta />
                </Box>
            </Stack>
            ```
            to
            ```html
            <Stack spacing={4}>
                <OrderSummary showPromoCodeForm={true} isEstimate={true} />
                <Box display={{base: 'none', lg: 'block'}}>
                    <BoltCheckout
                        api={api}
                        navigate={navigate}
                        customer={customer}
                        basket={basket}
                        basketContext={BasketContext}
                        boltType="cart"
                        />
                </Box>
            </Stack>
            ```
            
    - For the mobile mode, locate the file `your_project_path/app/pages/cart/partials/cart-cta.jsx`
        - Import Bolt component and necessary modules
            ```sh
            import BoltCheckout from "@boltpay/bolt-pwa-kit2.x/dist/index";
            import useBasket from '../../../commerce-api/hooks/useBasket'
            import useCustomer from '../../../commerce-api/hooks/useCustomer'
            import useNavigation from '../../../hooks/use-navigation'
            import { useCommerceAPI, BasketContext } from "../../../commerce-api/contexts";
            ```
            
        - Define constant variables within `const CartCta`
            ```javascript
            const CartCta = () => {
                const basket = useBasket()
                const api = useCommerceAPI()
                const customer = useCustomer()
                const navigate = useNavigation()
            ```
            
        - Replace original checkout button with the Bolt checkout button
            from 
            ```html
            <Fragment>
                <Button
                    as={Link}
                    to="/checkout"
                    width={['95%', '95%', '95%', '100%']}
                    marginTop={[6, 6, 2, 2]}
                    mb={4}
                    rightIcon={<LockIcon />}
                    variant="solid"
                >
                    <FormattedMessage
                        defaultMessage="Proceed to Checkout"
                        id="cart_cta.link.checkout"
                    />
                </Button>
                <Flex justify={'center'}>
                    <VisaIcon height={8} width={10} mr={2} />
                    <MastercardIcon height={8} width={10} mr={2} />
                    <AmexIcon height={8} width={10} mr={2} />
                    <DiscoverIcon height={8} width={10} mr={2} />
                </Flex>
            </Fragment>
            ```
            to
            ```html
            <Fragment>
                <BoltCheckout
                    api={api}
                    navigate={navigate}
                    customer={customer}
                    basket={basket}
                    basketContext={BasketContext}
                    boltType="cart"
                    />
                <Flex justify={'center'}>
                    <VisaIcon height={8} width={10} mr={2} />
                    <MastercardIcon height={8} width={10} mr={2} />
                    <AmexIcon height={8} width={10} mr={2} />
                    <DiscoverIcon height={8} width={10} mr={2} />
                </Flex>
            </Fragment>
            ```

7. Enable the Bolt checkout button on the add-to-cart model of product page:  

    - Locate the file `your_project_path/app/hooks/use-add-to-cart-modal.js`     
        - Import Bolt component and necessary modules
            ```sh
            import BoltCheckout from "@boltpay/bolt-pwa-kit2.x/dist/index";
            import useCustomer from "../commerce-api/hooks/useCustomer";
            import { useCommerceAPI, BasketContext } from "../commerce-api/contexts";
            import useNavigation from "./use-navigation";
            ```
            
        - Define constant variables within `const AddToCartModal`
            ```javascript
            export const AddToCartModal = () => {
                const api = useCommerceAPI();
                const navigate = useNavigation();
                const customer = useCustomer();
            ```
            
        - For the desktop mode, find the element `ModalBody` and replace original checkout button with the Bolt checkout button within its content
            from 
            ```html
            <Stack spacing="4">
                <Button as={Link} to="/cart" width="100%" variant="solid">
                    {intl.formatMessage({
                        defaultMessage: 'View Cart',
                        id: 'add_to_cart_modal.link.view_cart'
                    })}
                </Button>

                <Button
                    as={Link}
                    to="/checkout"
                    width="100%"
                    variant="outline"
                    rightIcon={<LockIcon />}
                >
                    {intl.formatMessage({
                        defaultMessage: 'Proceed to Checkout',
                        id: 'add_to_cart_modal.link.checkout'
                    })}
                </Button>
            </Stack>
            ```
            to
            ```html
            <Stack spacing="4">
                <Button as={Link} to="/cart" width="100%" variant="solid">
                  {intl.formatMessage({
                    defaultMessage: "View Cart",
                    id: "add_to_cart_modal.link.view_cart",
                  })}
                </Button>
    
                <BoltCheckout
                  api={api}
                  navigate={navigate}
                  customer={customer}
                  basket={basket}
                  basketContext={BasketContext}
                  boltType="pdp"
                  pos="normal"
                />
              </Stack>
            ```
        - For the mobile mode, find the element `ModalFooter` and replace original checkout button with the Bolt checkout button within its content
            from 
            ```html
            <Stack spacing="4">
                <Button as={Link} to="/cart" width="100%" variant="solid">
                    {intl.formatMessage({
                        defaultMessage: 'View Cart',
                        id: 'add_to_cart_modal.link.view_cart'
                    })}
                </Button>

                <Button
                    as={Link}
                    to="/checkout"
                    width="100%"
                    variant="outline"
                    rightIcon={<LockIcon />}
                >
                    {intl.formatMessage({
                        defaultMessage: 'Proceed to Checkout',
                        id: 'add_to_cart_modal.link.checkout'
                    })}
                </Button>
            </Stack>
            ```
            to
            ```html
            <Stack spacing="4">
                <Button as={Link} to="/cart" width="100%" variant="solid">
                  {intl.formatMessage({
                    defaultMessage: "View Cart",
                    id: "add_to_cart_modal.link.view_cart",
                  })}
                </Button>
                <BoltCheckout
                  api={api}
                  navigate={navigate}
                  customer={customer}
                  basket={basket}
                  basketContext={BasketContext}
                  boltType="pdp"
                  pos="mobile"
                />
            </Stack>
            ```

8. Configure backend site setting: Please refer to the README.md file in https://github.com/BoltApp/bolt-demandware-composable-backend