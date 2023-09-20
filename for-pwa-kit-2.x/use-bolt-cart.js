import ControllerBolt from "./controller-bolt";

/**
 * Hook for retrieving and managing state of Search Suggestions
 */
const useBoltCart = () => {
  const controller = new ControllerBolt();

  return {
    async getCartSession() {
      const response = await controller.getCartSession();
      return response;
    },

    async getDefaultShipmethod() {
      const response = await controller.getDefaultShipmethod();
      return response;
    },
  };
};

export default useBoltCart;
