import { toast, ToastContent, ToastOptions, Slide, Id } from "react-toastify";


export const defaultToastOptions: ToastOptions = {
    position: "top-right",
    autoClose: 1000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Slide,
};

type ToastType = "success" | "error" | "info" | "warning" | "default";

/**
 * Display toast
 *
 * @param {ToastType} type
 * @param {ToastContent} content
 * @param {ToastOptions} [options=defaultToastOption]
 * @return {Id}
 */
export const showToast = (
    { type = "default", content, options }: { type: ToastType, content: ToastContent, options?: Partial<ToastOptions> }

): Id => {
    const optionsToApply = { ...defaultToastOptions, ...options };

    switch (type) {
        case "success":
            return toast.success(content, optionsToApply);
        case "error":
            return toast.error(content, optionsToApply);
        case "info":
            return toast.info(content, optionsToApply);
        case "warning":
            return toast.warn(content, optionsToApply);
        case "default":
            return toast(content, optionsToApply);
        default:
            return toast(content, optionsToApply);
    }
};
export const toastPromise = async (
  promise: Promise<any>,
  messages: { loading: string; success: string; error: string },
  options?: Partial<ToastOptions>
) => {
  const toastId: Id = toast.loading(messages.loading, { ...defaultToastOptions, ...options });

  try {
    const result = await promise;

    toast.update(toastId, {
      render: messages.success,
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });

    return result;
  } catch (err: any) {
    toast.update(toastId, {
      render: messages.error || err.message || "Something went wrong",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
    throw err;
  }
};