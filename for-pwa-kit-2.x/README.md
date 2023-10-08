## Requirements

-   Node 18.x
-   npm 9.x

Currently Managed Runtime environment only supports Node.js 18.x, for more information, please see https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/upgrade-node-version.html

## Get Started

1. Install Bolt component package, run the command below from `your_project_path`
    ```sh
    npm install @boltpay/bolt-pwa-kit2.x
    ```

2. Update API Access

    Add these values to the `Scopes` field of your SLAS Client 

    ```sh
    sfcc.custom_objects sfcc.session_bridge sfcc.shopper-custom_objects
    ```

3. Complete the configuration files

    (1) Update SSR config, locate the file `your_project_path/app/ssr.js` and set HTTP security headers with bolt domain(*.bolt.com and *.bugsnag.com)

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

4. Enable the Bolt checkout button on the cart page:

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

5. Enable the Bolt checkout button on the add-to-cart model of product page:  

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

6. Configure backend site setting in Business Manager:

    (1) Go to  Administration > Site Development > Import & Export, upload file `metadata/bolt-meta-import/meta/system-objecttype-extensions.xml` and import it.

    (2) Go to Merchant Tools > Ordering > Payment Processors, create a new Processor with ID `BOLT_PAY`.

    (3) Go to  Merchant Tools > Ordering > Import & Export, upload file `metadata/bolt-meta-import/sites/RefArch/payment-methods.xml` and import it.

    (4) Go to Merchant Tools > Site Preferences > Custom Site Preference Groups, Click into group <Bolt Payment Setting - Managed Checkout> and add/update the bolt related configurations.

7. Configure OCAPI:

    (1) Navigate to Administration > Site Development > Open Commerce API Settings.
    (2) Navigate to `metadata/ocapi` folder.
    (3) Copy the contents of `OCAPIshop.json` within Shop Type > Open Commerce API Settings.
    (4) Replace `<<client_id>>` with your client_id.
    (5) Click `Save`.
    (6) Copy the content of `OCAPIdata.json` within Data Type > Open Commerce API Settings.
    (7) Select "Global (organization-wide)" from the Context Selection dropdown.
    (8) Replace `<<client_id>>` with your client_id.
    (9) Click `Save`.

8. Add SFRA cartridge to your code base:

    (1) Add cartridge `cartridges/int_bolt_pwa` to your project and upload it to the SFCC instance. 
    (2) In SFCC Business Manager, Go to Administration > Sites > Manage Sites, select the site, click on `Setting` Tab, add `int_bolt_pwa` at the beginning of the site path field with separator `:`.