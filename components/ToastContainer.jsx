import { useCallback } from "react";
import { View } from "react-native";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toast } from "./Toast";

/**
 * Container component that renders all active toasts.
 * Used at the top level of the app to display notifications.
 */
export function ToastContainer({ toasts, onDismiss }) {
    const { colorScheme } = useColorScheme();
    const insets = useSafeAreaInsets();

    return (
        <View
            pointerEvents="box-none"
            style={{
                position: "absolute",
                top: insets.top + 10,
                left: 0,
                right: 0,
                zIndex: 9999,
                alignItems: "center",
                paddingHorizontal: 16,
            }}
        >
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    id={toast.id}
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    duration={toast.duration}
                    onDismiss={onDismiss}
                    colorScheme={colorScheme}
                />
            ))}
        </View>
    );
}

let toastId = 0;

/**
 * Hook to show toasts from any component.
 * Usage: const toast = useToast();
 *        toast.success("Title", "Message");
 *        toast.error("Error", "Something went wrong");
 */
export function useToast(toastRef) {
    const show = useCallback(
        (type, title, message = "", duration = 3000) => {
            const id = toastId++;
            if (toastRef?.current?.addToast) {
                toastRef.current.addToast({
                    id,
                    type,
                    title,
                    message,
                    duration,
                });
            }
            return id;
        },
        [toastRef]
    );

    return {
        success: (title, message, duration) =>
            show("success", title, message, duration),
        error: (title, message, duration) => show("error", title, message, duration),
        info: (title, message, duration) => show("info", title, message, duration),
        show,
    };
}
