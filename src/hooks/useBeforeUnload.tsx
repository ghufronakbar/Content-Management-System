import { useEffect } from "react";

export const useBeforeUnload = (message?: string) => {
  return useEffect(() => {
    window.addEventListener("beforeunload", (e) => {
      const confirmationMessage = message || "Save your changes first?";

      (e || window.event).returnValue = confirmationMessage; //Gecko + IE
      alert(confirmationMessage);
      return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    });

    return () => {
      window.removeEventListener("beforeunload", () => {});
    };
  }, []);
};
