## Requirements

-   Node 18.x
-   npm 9.x

Currently Managed Runtime environment only supports Node.js 18.x, for more information, please see https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/upgrade-node-version.html

## Get Started

1. Find the latest version of v3.1.x from https://github.com/SalesforceCommerceCloud/pwa-kit/releases

2. Download the template-retail-react-app (eg. https://github.com/SalesforceCommerceCloud/pwa-kit/tree/v3.1.0/packages/template-retail-react-app) to your local and rename it (eg. bolt_pwa_kit)

3. Clone this repository to your local, and copy the folder `for-pwa-kit-3.x/bolt` to `bolt_pwa_kit/app/components`

4. Update the properties of `engines` in the bolt_pwa_kit/package.json 
    ```html
    "engines": {
        "node": "^18.0.0",
        "npm": "^9.0.0"
     },
    ```

5. Set Up API Access

    (1) Follow [this guide](https://developer.salesforce.com/docs/commerce/commerce-api/guide/authorization-for-shopper-apis.html#set-up-user-roles-and-filters) to Set Up User Roles and Filters
    
    (2) Follow [this guide](https://developer.salesforce.com/docs/commerce/commerce-api/guide/authorization-for-shopper-apis.html#create-a-slas-client) to Create a SLAS Client and get the `client id`, additionally change the `Scopes` of client to 

    ```sh
    sfcc.shopper-myaccount.baskets sfcc.shopper-discovery-search sfcc.shopper-myaccount.addresses sfcc.shopper-products sfcc.shopper-myaccount.rw sfcc.shopper-myaccount.paymentinstruments sfcc.custom_objects sfcc.shopper-customers.login sfcc.shopper-myaccount.orders sfcc.shopper-baskets-orders sfcc.shopper-customers.register sfcc.shopper-productlists sfcc.shopper-myaccount.addresses.rw sfcc.shopper-myaccount.productlists.rw sfcc.shopper-promotions sfcc.session_bridge sfcc.shopper-baskets-orders.rw sfcc.shopper-myaccount.paymentinstruments.rw sfcc.shopper-gift-certificates sfcc.shopper-custom_objects sfcc.shopper-product-search sfcc.shopper-myaccount.productlists sfcc.shopper-categories sfcc.shopper-myaccount
    ```
    
    (3) Follow [this guide](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/setting-up-api-access.html#update-open-commerce-api-settings) to Update Open Commerce API Settings

6. Complete the configuration files

    When a PWA Kit project is created with the Retail React App template, it comes with a single configuration file: `app/config/default.js`. The configuration objects that it exports are set based on the options provided to pwa-kit-create-app, but you can update your configuration at any time. Updates are often necessary after the initial project generation to stay in sync with changes to B2C Commerce instances.

    (1) Follow [this guide](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/configuration-options.html#api-access) to config API Access

    (2) Follow [this guide](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/proxying-requests.html#configure-the-local-development-environment) to configure proxies for local development env. and below is an example:

    ```javascript
    // Additional parameters that configure Express app behavior.
    ssrParameters: {
        ssrFunctionNodeVersion: "18.x",
        proxyConfigs: [
          {
            host: "kv7kzm78.api.commercecloud.salesforce.com",
            path: "api",
          },
          {
            host: "zzgv-022.dx.commercecloud.salesforce.com",
            path: "ocapi",
          },
        ],
    },
    ```

    (3) Update SSR config, locate the file `bolt_pwa_kit/app/ssr.js` and set HTTP security headers

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
    
7. Install packages with dependencies

    ```sh
    npm install
    npm ci
    ```

8. Enable the Bolt checkout button on the cart page:

    - For the desktop mode, locate the file bolt_pwa_kit/app/pages/cart/index.jsx
        - Import Bolt component 
            ```sh
            import BoltCheckout from '@salesforce/retail-react-app/app/components/bolt'
            ```
        - Replace original checkout button with the Bolt checkout button
            from 
            ```html
            <GridItem>
                <Stack spacing={4}>
                    <OrderSummary
                        htmlowPromoCodeForm={true}
                        isEstimate={true}
                        basket={basket}
                    />
                    <Box display={{base: 'none', lg: 'block'}}>
                        <CartCta />
                    </Box>
                </Stack>
            </GridItem>
            ```
            to
            ```html
            <GridItem>
                <Stack spacing={4}>
                    <OrderSummary
                        showPromoCodeForm={true}
                        isEstimate={true}
                        basket={basket}
                    />
                    <Box display={{base: 'none', lg: 'block'}}>
                        <BoltCheckout />
                    </Box>
                </Stack>
            </GridItem>
            ```
    - For the mobile mode, locate the file bolt_pwa_kit/app/pages/cart/partials/cart-cta.jsx
        - Import Bolt component 
            ```sh
            import BoltCheckout from '@salesforce/retail-react-app/app/components/bolt'
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
                <BoltCheckout />
                <Flex justify={'center'}>
                    <VisaIcon height={8} width={10} mr={2} />
                    <MastercardIcon height={8} width={10} mr={2} />
                    <AmexIcon height={8} width={10} mr={2} />
                    <DiscoverIcon height={8} width={10} mr={2} />
                </Flex>
            </Fragment>
            ```

9. Enable the Bolt checkout button on the add-to-cart model of product page:  

    - Locate the file bolt_pwa_kit/app/hooks/use-add-to-cart-modal.js
        - Import Bolt component 
            ```sh
            import BoltCheckout from '@salesforce/retail-react-app/app/components/bolt'
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
                        defaultMessage: 'View Cart',
                        id: 'add_to_cart_modal.link.view_cart'
                    })}
                </Button>

                <BoltCheckout boltType="pdp" />
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
                        defaultMessage: 'View Cart',
                        id: 'add_to_cart_modal.link.view_cart'
                    })}
                </Button>

                <BoltCheckout boltType="pdp" pos="mobile" />
            </Stack>
            ```

10. To start your web server for local development, just update the html content of Bolt checkout button

    from

    ```html
    <div>
      <div className="bolt-cart-button" data-cart-total="" data-tid="instant-bolt-checkout-button" ref={boltButtonRef}>
          <object data={boltConfig.boltCdnUrl + "/v1/checkout_button?publishable_key=" + boltConfig.boltMultiPublishableKey}></object>
      </div>
    </div>
    ```

    to

    ```html
    <div>
      <div
        data-tid="instant-bolt-checkout-button"
        className="bolt-checkout-button"
        ref={boltButtonRef}
      >
        <script
          id="bolt-connect"
          type="text/javascript"
          src="https://connect.yourname.dev.bolt.me"
          data-publishable-key={boltConfig.boltMultiPublishableKey}
        ></script>
      </div>
    </div>
    ```
    
    Also you need to add `"*.yourname-external.dev.bolt.me",` to HTTP security headers in the file `bolt_pwa_kit/app/ssr.js`, eg.
    
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
                "*.ning-external.dev.bolt.me",
              ],
              "connect-src": [
                "'self'",
                "api.cquotient.com",
                "*.bolt.com",
                "*.bugsnag.com",
                "*.ning-external.dev.bolt.me",
              ],
              "frame-src": [
                "'self'",
                "*.bolt.com",
                "*.bugsnag.com",
                "*.ning-external.dev.bolt.me",
              ],
              "object-src": [
                "'self'",
                "*.bolt.com",
                "*.bugsnag.com",
                "*.ning-external.dev.bolt.me",
              ],
              // Do not upgrade insecure requests for local development
              "upgrade-insecure-requests": isRemote() ? [] : null,
            },
          },
          hsts: isRemote(),
        })
      );

    ```
11. To use Managed Runtime to deploy and monitor your PWA Kit storefront

    Prerequisites
    - You must have the Managed Runtime User role in Account Manager
    - You must belong to a partner or customer Organization in the Runtime Admin tool

    (1) [Log in to the Managed Runtime](https://quip.com/xul7AKPoTyHv#temp:C:IRb65d6439c23754dfa8262c102f)

    (2) [Create An Environment in Managed Runtime](https://quip.com/xul7AKPoTyHv#temp:C:IRbe60f236bbb7944528d83eb095)
    
    (3) [Push and Deploy a Bundle](https://quip.com/xul7AKPoTyHv)
