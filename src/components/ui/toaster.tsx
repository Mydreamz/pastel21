
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
          <Toast key={id} {...props} className="glass-card border-border/50 bg-card text-card-foreground">
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
