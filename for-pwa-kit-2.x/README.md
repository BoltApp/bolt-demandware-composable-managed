## Requirements

-   Node 18.x
-   npm 9.x

Currently Managed Runtime environment only supports Node.js 18.x, for more information, please see https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/upgrade-node-version.html

## Get Started

1. Find the latest version of v2.7.x from https://github.com/SalesforceCommerceCloud/pwa-kit/releases

2. Download the template-retail-react-app (eg. https://github.com/SalesforceCommerceCloud/pwa-kit/tree/v2.7.4/packages/template-retail-react-app) to your local and rename it (eg. bolt_pwa_kit) 

3. Clone this repository to your local, and copy the folder `for-pwa-kit-2.x/bolt` to `bolt_pwa_kit/app/components`

4. Update the properties of `engines` in the bolt_pwa_kit/package.json 
    ```sh
    "engines": {
        "node": "^18.0.0",
        "npm": "^9.0.0"
     },
    ```

5. Follow [this guide](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/setting-up-api-access.html) to set up API access

6. Follow [this guide](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/configuration-options.html) to complete the configuration files

7. Update SSR config, locate the file `bolt_pwa_kit/app/ssr.js` and set HTTP security headers
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
    
8. Install packages with dependencies
    ```sh
    npm install
    npm ci
    ```

9. Enable the Bolt checkout button on the cart page:

    - For the desktop mode, locate the file bolt_pwa_kit/app/pages/cart/index.jsx
        - Import Bolt component 
            ```sh
            import {BoltCheckout} from '../../components/bolt'
            ```
        - Replace original checkout button with the Bolt checkout button
            from 
            ```sh
            <Stack spacing={4}>
                <OrderSummary showPromoCodeForm={true} isEstimate={true} />
                <Box display={{base: 'none', lg: 'block'}}>
                    <BoltCheckout />
                </Box>
            </Stack>
            ```
            to
            ```sh
            <Stack spacing={4}>
                <OrderSummary showPromoCodeForm={true} isEstimate={true} />
                <Box display={{base: 'none', lg: 'block'}}>
                    <CartCta />
                </Box>
            </Stack>
            ```
    - For the mobile mode, locate the file bolt_pwa_kit/app/pages/cart/partials/cart-cta.jsx
        - Import Bolt component 
            ```sh
            import {BoltCheckout} from '../../../components/bolt'
            ```
        - Replace original checkout button with the Bolt checkout button
            from 
            ```sh
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
            ```sh
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
10. Enable the Bolt checkout button on the add-to-cart model of product page:  
    - Locate the file bolt_pwa_kit/app/hooks/use-add-to-cart-modal.js     
        - Import Bolt component 
            ```sh
            import { BoltCheckoutPDP } from "../components/bolt";
            ```
        - For the desktop mode, find the element `ModalBody` and replace original checkout button with the Bolt checkout button within its content
            from 
            ```sh
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
            ```sh
            <Stack spacing="4">
                <Button as={Link} to="/cart" width="100%" variant="solid">
                  {intl.formatMessage({
                    defaultMessage: "View Cart",
                    id: "add_to_cart_modal.link.view_cart",
                  })}
                </Button>
    
                <BoltCheckoutPDP pos="normal" />
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
                <BoltCheckoutPDP pos="mobile" />
            </Stack>
            ```
11. To start your web server for local development, just update the html content of Bolt checkout button
    from
    ```html
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
          type="text/html"
          src="https://connect.ning.dev.bolt.me"
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