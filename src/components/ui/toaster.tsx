
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="bg-card border border-border shadow-sm">
            <div className="grid gap-1">
              {title && <ToastTitle className="text-foreground">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-muted-foreground">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-muted-foreground hover:text-foreground" />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
