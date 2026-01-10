import toast from "react-hot-toast";
import { MdCheckCircle, MdCancel } from "react-icons/md";

export const confirmDialog = (message, onConfirm, onCancel) => {
  const toastId = toast.custom(
    (t) => (
      <div className="bg-white rounded-lg shadow-2xl p-4 border-l-4 border-blue-500 max-w-sm animate-slide-in-down">
        <div className="flex items-start gap-3">
          <div className="text-2xl">⚠️</div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Confirm Action
            </h3>
            <p className="text-sm text-gray-600 mb-3">{message}</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  onCancel?.();
                }}
                className="px-3 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium flex items-center gap-1 text-sm"
              >
                <MdCancel className="w-3 h-3" />
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  onConfirm?.();
                }}
                className="px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium flex items-center gap-1 text-sm"
              >
                <MdCheckCircle className="w-3 h-3" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: "top-center",
    }
  );
};
