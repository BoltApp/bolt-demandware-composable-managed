import React, { useEffect, useState } from "react";
import { BoltHeader } from "./bolt-header";
import { BoltButtonPDP } from "./bolt-button-pdp";
import ControllerBolt from "./controller-bolt";

export const BoltCheckoutPDP = ({ pos }) => {
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
        <BoltButtonPDP boltConfig={boltConfig} pos={pos} />
      )}
    </>
  );
};
