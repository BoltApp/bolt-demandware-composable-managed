/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from "react";
import App from "@salesforce/retail-react-app/app/components/_app/index.jsx";
import { renderWithProviders } from "@salesforce/retail-react-app/app/utils/test-utils";
import { DEFAULT_LOCALE } from "@salesforce/retail-react-app/app/utils/test-utils";
import useMultiSite from "@salesforce/retail-react-app/app/hooks/use-multi-site";
import { screen, waitFor } from "@testing-library/react";
import messages from "@salesforce/retail-react-app/app/static/translations/compiled/en-GB.json";
import mockConfig from "@salesforce/retail-react-app/config/mocks/default";
import { act } from "react-dom/test-utils";
import { rest } from "msw";
import {
  mockShippingMethods,
  mockCustomerBaskets,
  mockCartVariant,
  mockedCustomerProductLists,
} from "@salesforce/retail-react-app/app/mocks/mock-data";
import mockVariant from "@salesforce/retail-react-app/app/mocks/variant-750518699578M";

import Cart from "@salesforce/retail-react-app/app/pages/cart/index";

const mockProduct = {
  ...mockVariant,
  id: "750518699660M",
  variationValues: {
    color: "BLACKFB",
    size: "050",
    width: "V",
  },
  c_color: "BLACKFB",
  c_isNew: true,
  c_refinementColor: "black",
  c_size: "050",
  c_width: "V",
};

const customerEmail = "email@test.com";

jest.setTimeout(60000);

jest.mock("../../hooks/use-multi-site", () => jest.fn());

const site = {
  ...mockConfig.app.sites[0],
  alias: "uk",
};

const locale = DEFAULT_LOCALE;

const buildUrl = jest.fn().mockImplementation((href, site, locale) => {
  return `${site ? `/${site}` : ""}${locale ? `/${locale}` : ""}${href}`;
});

const resultUseMultiSite = {
  site,
  locale,
  buildUrl,
};

const controllerConfigResponse = {
  action: "Bolt-GetBoltConfig",
  queryString: "",
  locale: "en_US",
  config: {
    boltEnable: true,
    boltEnableCartPage: true,
    boltEnableSSO: true,
    boltMerchantDivisionID: "ihuG0Nt6vYP1",
    boltCdnUrl: "https://connect-sandbox.bolt.com",
    boltAccountURL: "https://account-sandbox.bolt.com",
    boltMultiPublishableKey: "abcde12345",
    blockedCharactersList: null,
    sfccBaseVersion: 6,
    boltEnablePPC: false,
  },
};

beforeEach(() => {
  jest.resetModules();
  jest.spyOn(console, "groupCollapsed").mockImplementation(jest.fn());

  global.server.use(
    // mock updating basket currency
    rest.patch("*/baskets/:basketId", (req, res, ctx) => {
      const basket = mockCustomerBaskets.baskets[0];
      basket.currency = "USD";
      return res(ctx.json(basket));
    }),
    // mock adding guest email to basket
    rest.put("*/baskets/:basketId/customer", (req, res, ctx) => {
      const basket = mockCustomerBaskets.baskets[0];
      basket.customerInfo.email = customerEmail;
      return res(ctx.json(basket));
    }),

    rest.get("*/customers/:customerId/product-lists", (req, res, ctx) => {
      return res(ctx.delay(0), ctx.json(mockedCustomerProductLists));
    }),
    rest.get("*/products/:productId", (req, res, ctx) => {
      return res(ctx.delay(0), ctx.json(mockProduct));
    }),
    rest.get("*/products", (req, res, ctx) => {
      return res(ctx.delay(0), ctx.json({ data: [mockCartVariant] }));
    }),
    rest.get("*/customers/:customerId/baskets", (req, res, ctx) => {
      return res(ctx.delay(0), ctx.json(mockCustomerBaskets));
    }),

    rest.put("*/baskets/:basketId/shipments/:shipmentId", (req, res, ctx) => {
      const basket = mockCustomerBaskets.baskets[0];
      const updatedBasketWithShippingMethod = {
        ...basket,
        shipments: [
          {
            ...basket.shipments[0],
            shippingMethod: {
              description: "Order received the next business day",
              id: "003",
              name: "Overnight",
              price: 29.99,
            },
            shippingAddress: {
              address1: "4911  Lincoln Street",
              postalCode: "97350",
              city: "IDANHA",
              countryCode: "US",
              firstName: "Ward J",
              fullName: "Ward J Adamek",
              id: "b3e1269a2c1d0ad56694206741",
              lastName: "Adamek",
              stateCode: "OR",
            },
          },
        ],
      };
      return res(ctx.delay(0), ctx.json(updatedBasketWithShippingMethod));
    }),
    rest.get("*/baskets/:basketId/shipments", (req, res, ctx) => {
      return res(ctx.delay(0), ctx.json(mockShippingMethods));
    }),

    rest.put("*/shipments/me/shipping-method", (req, res, ctx) => {
      const basketWithShipment = {
        ...mockCustomerBaskets.baskets[0],
        shipments: [
          {
            ...mockCustomerBaskets.baskets[0].shipments[0],
            shippingMethod: {
              description: "Order received within 7-10 business days",
              id: "GBP001",
              name: "Ground",
              price: 7.99,
              shippingPromotions: [
                {
                  calloutMsg: "Free Shipping Amount Above 50",
                  promotionId: "FreeShippingAmountAbove50",
                  promotionName: "Free Shipping Amount Above 50",
                },
              ],
              c_estimatedArrivalTime: "7-10 Business Days",
            },
          },
        ],
      };
      return res(ctx.delay(0), ctx.json(basketWithShipment));
    }),

    rest.get("*/shipments/me/shipping-methods", (req, res, ctx) => {
      return res(ctx.delay(0), ctx.json(mockShippingMethods));
    }),

    rest.patch("*/baskets/:basketId/items/:itemId", (req, res, ctx) => {
      const basket = mockCustomerBaskets.baskets[0];
      const updatedQuantityCustomerBasket = {
        ...basket,
        shipments: [
          {
            ...basket.shipments[0],
            productItems: [
              {
                adjustedTax: 2.93,
                basePrice: 61.43,
                bonusProductLineItem: false,
                gift: false,
                itemId: "4a9af0a24fe46c3f6d8721b371",
                itemText: "Belted Cardigan With Studs",
                price: 61.43,
                priceAfterItemDiscount: 61.43,
                priceAfterOrderDiscount: 61.43,
                productId: "701642889830M",
                productName: "Belted Cardigan With Studs",
                quantity: 3,
                shipmentId: "me",
                tax: 2.93,
                taxBasis: 61.43,
                taxClassId: "standard",
                taxRate: 0.05,
              },
            ],
          },
        ],
      };
      return res(ctx.json(updatedQuantityCustomerBasket));
    })
  );
});

afterEach(() => {
  jest.resetModules();
  localStorage.clear();
});

describe("test Bolt component class", () => {
  test("Bolt component is rendered appropriately", async () => {
    global.server.use(
      rest.get("*/Bolt-GetBoltConfig", (req, res, ctx) => {
        return res(ctx.delay(0), ctx.json(controllerConfigResponse));
      })
    );

    useMultiSite.mockImplementation(() => resultUseMultiSite);

    await act(async () => {
      renderWithProviders(
        <App
          targetLocale={DEFAULT_LOCALE}
          defaultLocale={DEFAULT_LOCALE}
          messages={messages}
        >
          <Cart />
        </App>
      );
    });

    await waitFor(() => {
      expect(screen.getByRole("main")).toBeInTheDocument();
      const boltBtn = document.querySelector(".bolt-cart-button");
      expect(boltBtn).toBeInTheDocument();
      const boltBtnObj = document.querySelector(".bolt-cart-button object");
      expect(boltBtnObj).toHaveAttribute(
        "data",
        "https://connect-sandbox.bolt.com/v1/checkout_button?publishable_key=abcde12345"
      );

      expect(screen.getByTestId("sf-cart-container")).toBeInTheDocument();
      expect(
        screen.getByText(/Belted Cardigan With Studs/i)
      ).toBeInTheDocument();
    });
  });
});
