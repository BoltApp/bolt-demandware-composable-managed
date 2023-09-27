## Requirements

-   Node 18.x
-   npm 9.x

Currently Managed Runtime environment only supports Node.js 18.x, for more information, please see https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/upgrade-node-version.html

## Get Started

1. Clone this repository to your local, and copy the folder `for-pwa-kit-3.x/bolt` to `your_project_path/app/components`

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
    - For the mobile mode, locate the file `your_project_path/app/pages/cart/partials/cart-cta.jsx`
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

7. Enable the Bolt checkout button on the add-to-cart model of product page:  

    - Locate the file `your_project_path/app/hooks/use-add-to-cart-modal.js`
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

8. Configure backend site setting in Business Manager:

    (1) Go to  Administration > Site Development > Import & Export, upload file `metadata/bolt-meta-import/meta/system-objecttype-extensions.xml` and import it.

    (2) Go to Merchant Tools > Ordering > Payment Processors, create a new Processor with ID `BOLT_PAY`.

    (3) Go to  Merchant Tools > Ordering > Import & Export, upload file `metadata/bolt-meta-import/sites/RefArch/payment-methods.xml` and import it.

    (4) Go to Merchant Tools > Site Preferences > Custom Site Preference Groups, Click into group <Bolt Payment Setting - Managed Checkout> and add/update the bolt related configurations.

9. Configure OCAPI:

    (1) Navigate to Administration > Site Development > Open Commerce API Settings.
    (2) Navigate to `metadata/ocapi` folder.
    (3) Copy the contents of `OCAPIshop.json` within Shop Type > Open Commerce API Settings.
    (4) Replace `<<client_id>>` with your client_id.
    (5) Click `Save`.
    (6) Copy the content of `OCAPIdata.json` within Data Type > Open Commerce API Settings.
    (7) Select "Global (organization-wide)" from the Context Selection dropdown.
    (8) Replace `<<client_id>>` with your client_id.
    (9) Click `Save`.

10. Add SFRA cartridge to your code base:

    (1) Add cartridge `cartridges/int_bolt_pwa` to your project and upload it to the SFCC instance. 
    (2) In SFCC Business Manager, Go to Administration > Sites > Manage Sites, select the site, click on `Setting` Tab, add `int_bolt_pwa` at the beginning of the site path field with separator `:`.