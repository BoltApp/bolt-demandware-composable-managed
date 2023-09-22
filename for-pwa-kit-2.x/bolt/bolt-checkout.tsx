import React, { useEffect, useState } from "react";
import { BoltHeader } from "./bolt-header";
import { BoltButton } from "./bolt-button";
import ControllerBolt from "./controller-bolt";

export const BoltCheckout = () => {
  const controller = new ControllerBolt();
  const [boltConfig, setBoltConfig] = useState(null);

  useEffect(() => {
    let active = true;
    load();
    return () => {
      active = false;
    };

    async function load() {
      const boltConfigData = await controller.getBoltConfig();
      if (boltConfigData?.config) {
        setBoltConfig(boltConfigData.config);
      }
      if (!active) {
        return;
      }
    }
  }, []);

  return (
    <>
      {boltConfig && boltConfig?.boltMultiPublishableKey && (
        <BoltHeader boltConfig={boltConfig} />
      )}
      {boltConfig && boltConfig?.boltMultiPublishableKey && (
        <BoltButton boltConfig={boltConfig} />
      )}
    </>
  );
};
