/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from "react";
import { renderWithProviders } from "../../utils/test-utils";
import { screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import App from "../_app/index.jsx";
import BoltCheckout from "./index";
import mockConfig from "../../../config/mocks/default";
import useMultiSite from "../../hooks/use-multi-site";
import { DEFAULT_LOCALE } from "../../utils/test-utils";
import messages from "../../translations/compiled/en-GB.json";
import { rest } from "msw";
import useShopper from "../../commerce-api/hooks/useShopper";
import {
  ocapiBasketWithItem,
  mockShippingMethods,
  mockPaymentMethods,
  mockedGuestCustomer,
  mockedRegisteredCustomer,
  productsResponse,
} from "../../commerce-api/mock-data";
import mockBasketWithSuit from "../../commerce-api/mocks/basket-with-suit";
import { keysToCamel } from "../../commerce-api/utils";

let mockedBasketResponse = keysToCamel(mockBasketWithSuit);
let mockedShippingMethodsResponse = keysToCamel(mockShippingMethods);

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

jest.setTimeout(60000);

jest.mock("../../hooks/use-multi-site", () => jest.fn());
jest.mock("../../commerce-api/einstein");

// Make sure fetch is defined in test env
Object.defineProperty(window, "fetch", {
  value: require("cross-fetch"),
});

jest.mock("../../commerce-api/utils", () => {
  const originalModule = jest.requireActual("../../commerce-api/utils");
  return {
    ...originalModule,
    isTokenExpired: jest.fn().mockReturnValue(false),
    hasSFRAAuthStateChanged: jest.fn().mockReturnValue(false),
    createGetTokenBody: jest.fn().mockReturnValue({
      grantType: "test",
      code: "test",
      usid: "test",
      codeVerifier: "test",
      redirectUri: "http://localhost/test",
    }),
  };
});

jest.mock("../../commerce-api/auth", () => {
  return class AuthMock {
    login() {
      return mockedGuestCustomer;
    }
  };
});

jest.mock("../../commerce-api/ocapi-shopper-baskets", () => {
  return class ShopperBasketsMock {
    async addCouponToBasket() {
      return mockedBasketResponse;
    }
    async removeCouponFromBasket() {
      return mockedBasketResponse;
    }
    async removeItemFromBasket() {
      return mockedBasketResponse;
    }
    async updateItemInBasket() {
      return mockedBasketResponse;
    }
    async updateBasket() {
      return mockedBasketResponse;
    }
    async updateShippingMethodForShipment() {
      return mockedBasketResponse;
    }
    async getShippingMethodsForShipment() {
      return mockedShippingMethodsResponse;
    }
  };
});

const WrappedCart = () => {
  useShopper();
  return <BoltCheckout />;
};

// Set up and clean up
beforeEach(() => {
  jest.resetModules();
  global.server.use(
    // mock empty guest basket
    rest.get("*/customers/:customerId/baskets", (req, res, ctx) => {
      return res(
        ctx.json({
          baskets: [keysToCamel(ocapiBasketWithItem)],
        })
      );
    }),

    // mock product variant detail
    rest.get("*/products", (req, res, ctx) => {
      return res(ctx.json(productsResponse));
    }),

    // mock available shipping methods
    rest.get("*/shipments/me/shipping_methods", (req, res, ctx) => {
      return res(ctx.json(mockShippingMethods));
    }),

    // mock available payment methods
    rest.get("*/baskets/:basketId/payment_methods", (req, res, ctx) => {
      return res(ctx.json(mockPaymentMethods));
    }),

    // mock product details
    rest.get("*/products", (req, res, ctx) => {
      return res(ctx.json({ data: [{ id: "701642811398M" }] }));
    }),

    rest.get("*/customers/:customerId", (req, res, ctx) => {
      return res(
        ctx.delay(0),
        ctx.status(200),
        ctx.json({
          authType: "guest",
          preferredLocale: "en_US",
          ...mockedRegisteredCustomer,
          // Mocked customer ID should match the mocked basket's customer ID as
          // it would with real usage, otherwise, the useShopper hook will detect
          // the mismatch and attempt to refetch a new basket for the customer.
          customerId: ocapiBasketWithItem.customer_info.customer_id,
        })
      );
    })
  );
});
afterEach(() => {
  jest.resetModules();
  localStorage.clear();
});

describe("test Bolt component class", () => {
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

  test("App component is rendered appropriately", async () => {
    useMultiSite.mockImplementation(() => resultUseMultiSite);

    global.server.use(
      rest.get("*/Bolt-GetBoltConfig", (req, res, ctx) => {
        return res(ctx.delay(0), ctx.json(controllerConfigResponse));
      })
    );

    await act(async () => {
      renderWithProviders(
        <App
          targetLocale={DEFAULT_LOCALE}
          defaultLocale={DEFAULT_LOCALE}
          messages={messages}
        >
          <WrappedCart />
        </App>
      );
    });

    //expect(hreflangLinks.length).toBe(1);
    await waitFor(() => {
      expect(screen.getByRole("main")).toBeInTheDocument();
      const boltBtn = document.querySelector(".bolt-cart-button");
      expect(boltBtn).toBeInTheDocument();
      const boltBtnObj = document.querySelector(".bolt-cart-button object");
      expect(boltBtnObj).toHaveAttribute(
        "data",
        "https://connect-sandbox.bolt.com/v1/checkout_button?publishable_key=abcde12345"
      );
    });
  });
});
