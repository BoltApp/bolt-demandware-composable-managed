import { useContext, useMemo } from "react";
import { BoltConfigContext } from "@salesforce/retail-react-app/app/components/bolt/contexts";
import ControllerBolt from "@salesforce/retail-react-app/app/components/bolt/controller-bolt";

export default function useBoltConfig() {
  const { state, actions } = useContext(BoltConfigContext);
  const controller = new ControllerBolt();

  const self = useMemo(() => {
    return {
      config: state.boltconfig,

      reset() {
        actions.reset();
      },

      getOrCreateConfig: async () => {
        if (state?.boltconfig) {
          return state.boltconfig;
        }
        const boltConfig = await controller.getBoltConfig();
        if (boltConfig?.config) {
          actions.add(boltConfig);
        }
        return state.boltconfig;
      },
    };
  }, [state]);

  return self;
}
