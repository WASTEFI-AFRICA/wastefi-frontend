# React Hooks

Custom React hooks for the WasteFi application.

## useToast

A powerful hook for displaying toast notifications throughout the application.

### Features

- **Multiple Variants**: success, error, warning, info
- **Auto-dismiss**: Configurable timeout with manual close option
- **Global State**: Managed with Zustand for easy access anywhere
- **Accessibility**: ARIA attributes for screen readers
- **Customizable**: Optional titles, custom durations, and positioning

### Basic Usage

```tsx
import { useToast } from "@/lib/hooks/useToast";

function MyComponent() {
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      await submitData();
      toast.success("Data submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit data", {
        title: "Submission Error"
      });
    }
  };

  return <button onClick={handleSubmit}>Submit</button>;
}
```

### API Reference

#### Methods

##### `show(message, options?)`
Display a toast with custom options.

```tsx
toast.show("Processing your request...", {
  variant: "info",
  title: "Please Wait",
  duration: 3000
});
```

##### `success(message, options?)`
Display a success toast (green with checkmark icon).

```tsx
toast.success("Collection submitted successfully!");

// With title and custom duration
toast.success("Payment processed", {
  title: "Success",
  duration: 4000
});
```

##### `error(message, options?)`
Display an error toast (red with alert icon).

```tsx
toast.error("Failed to process payment");

// With title
toast.error("Invalid credentials", {
  title: "Authentication Error"
});
```

##### `warning(message, options?)`
Display a warning toast (orange with warning icon).

```tsx
toast.warning("You have pending submissions");

// With custom duration
toast.warning("Low stock alert", {
  duration: 10000
});
```

##### `info(message, options?)`
Display an info toast (blue with info icon).

```tsx
toast.info("Your profile has been updated");
```

##### `dismiss(id)`
Manually dismiss a specific toast.

```tsx
const toastId = "custom-toast-id";
toast.dismiss(toastId);
```

##### `clearAll()`
Clear all active toasts.

```tsx
toast.clearAll();
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `variant` | `"success" \| "error" \| "warning" \| "info"` | `"info"` | Toast color and icon |
| `title` | `string` | - | Optional title above message |
| `duration` | `number` | `5000` | Auto-dismiss delay in ms (0 to disable) |

### Examples

#### Success Notification
```tsx
// Simple success
toast.success("Changes saved!");

// With title
toast.success("Your profile has been updated", {
  title: "Profile Updated"
});

// No auto-dismiss
toast.success("Important: Review required", {
  duration: 0
});
```

#### Error Handling
```tsx
try {
  await api.submitCollection(data);
  toast.success("Collection submitted successfully!");
} catch (error) {
  toast.error(
    error.message || "An unexpected error occurred",
    { title: "Submission Failed" }
  );
}
```

#### Loading States
```tsx
const handleAction = async () => {
  toast.info("Processing...", { duration: 0 });

  try {
    await performAction();
    toast.clearAll();
    toast.success("Action completed!");
  } catch (error) {
    toast.clearAll();
    toast.error("Action failed");
  }
};
```

#### Multiple Toasts
```tsx
// Stack multiple notifications
toast.info("Starting sync...");
setTimeout(() => {
  toast.success("Data synced!");
}, 2000);
setTimeout(() => {
  toast.success("Backup created!");
}, 4000);
```

### Global Configuration

The toast position can be configured in `ToastProvider.tsx`:

```tsx
<ToastContainer
  toasts={toasts}
  position="top-right" // Change position here
/>
```

Available positions:
- `top-right` (default)
- `top-left`
- `bottom-right`
- `bottom-left`
- `top-center`
- `bottom-center`

### Accessibility

All toasts include:
- `role="alert"` for screen reader announcements
- `aria-live="polite"` for non-intrusive notifications
- Keyboard-accessible close button
- Focus management for dismiss action

### Best Practices

1. **Keep messages concise**: Aim for 1-2 short sentences
2. **Use appropriate variants**: Match the severity to the variant
3. **Provide context with titles**: Use titles for clarity when needed
4. **Set reasonable durations**:
   - Success: 3-5 seconds
   - Info: 5 seconds
   - Warning: 7-10 seconds
   - Error: Keep visible (duration: 0) or longer timeout
5. **Don't overuse**: Avoid showing multiple toasts for the same action
6. **Test with screen readers**: Ensure messages are announced properly

### Implementation Details

The toast system uses:
- **Zustand** for global state management
- **Automatic cleanup** with useEffect timers
- **CSS animations** for smooth entrance/exit
- **Responsive design** that works on mobile and desktop
- **Dark mode support** via CSS variables
