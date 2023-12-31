import { createControllerFetch } from "./utils";
import { getConfig } from "@salesforce/pwa-kit-runtime/utils/ssr-config";

class ControllerBolt {
  constructor() {
    const { app: appConfig } = getConfig();
    this.fetch = createControllerFetch(appConfig.commerceAPI);
  }

  async getBoltConfig() {
    return await this.fetch("Bolt-GetBoltConfig", "GET", "force-cache");
  }

  async getDefaultShipmethod() {
    return await this.fetch("Bolt-GetDefaultShippingMethod", "GET");
  }
}

export default ControllerBolt;
