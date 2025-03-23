import React from "react";
import { toast } from "sonner";

type ToastMessage = {
  type: "success" | "danger" | "warning";
  message: string;
  onClose: () => void;
};


const showToast = (message: ToastMessage) => {
    switch (message.type) {
      case "success":
        toast.success(message.message);
        break;
      case "danger":
        toast.error(message.message);
        break;
      case "warning":
        toast.warning(message.message);
        break;
      default:
        toast(message.message);
    }
};

export default showToast;