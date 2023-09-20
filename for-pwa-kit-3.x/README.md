## Requirements

-   Node 18.x
-   npm 9.x

Currently Managed Runtime environment only supports Node.js 18.x, for more information, please see https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/upgrade-node-version.html

## Get Started

1. Find the latest version of v3.1.x from https://github.com/SalesforceCommerceCloud/pwa-kit/releases

2. Download the template-retail-react-app (eg. https://github.com/SalesforceCommerceCloud/pwa-kit/tree/v3.1.0/packages/template-retail-react-app) to your local and rename it (eg. bolt_pwa_kit), head to bolt_pwa_kit/app/components and create a new folder "bolt" 

3. Clone this repository to your local, and copy all the files to the new folder "bolt" just created in the previous step

4. Update the properties of `engines` in the bolt_pwa_kit/package.json 
    ```html
    "engines": {
        "node": "^18.0.0",
        "npm": "^9.0.0"
     },
    ```

5. Follow [this guide](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/setting-up-api-access.html) to set up API access

6. Follow [this guide](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/configuration-options.html) to complete the configuration files

7. Enable the Bolt checkout button on the cart page:

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
8. Enable the Bolt checkout button on the add-to-cart model of product page:  
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
9. To start your web server for local development, just update the html content of Bolt checkout button
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