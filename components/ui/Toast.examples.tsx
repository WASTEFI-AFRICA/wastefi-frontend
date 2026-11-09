/**
 * Toast Notification Examples
 * This file demonstrates various use cases for the toast notification system.
 * These examples are for reference only and are not imported in the application.
 */

import { useToast } from "@/lib/hooks/useToast";

/**
 * Example 1: Basic Success Notification
 */
export function BasicSuccessExample() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success("Collection submitted successfully!");
  };

  return <button onClick={handleSuccess}>Submit Collection</button>;
}

/**
 * Example 2: Error with Title
 */
export function ErrorWithTitleExample() {
  const toast = useToast();

  const handleError = async () => {
    try {
      // Some operation that might fail
      throw new Error("Network error");
    } catch (error) {
      toast.error("Unable to process your request. Please try again.", {
        title: "Request Failed"
      });
    }
  };

  return <button onClick={handleError}>Trigger Error</button>;
}

/**
 * Example 3: Custom Duration
 */
export function CustomDurationExample() {
  const toast = useToast();

  const handleLongWarning = () => {
    toast.warning("Please review your submission before proceeding.", {
      title: "Important Notice",
      duration: 10000 // 10 seconds
    });
  };

  return <button onClick={handleLongWarning}>Show Long Warning</button>;
}

/**
 * Example 4: Persistent Toast (No Auto-dismiss)
 */
export function PersistentToastExample() {
  const toast = useToast();

  const handlePersistent = () => {
    toast.error("Critical error occurred. Manual intervention required.", {
      title: "Critical Error",
      duration: 0 // Won't auto-dismiss
    });
  };

  return <button onClick={handlePersistent}>Show Persistent Error</button>;
}

/**
 * Example 5: Loading State with Toast
 */
export function LoadingStateExample() {
  const toast = useToast();

  const handleAsyncOperation = async () => {
    // Show loading toast
    toast.info("Processing your request...", { duration: 0 });

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear all toasts and show success
      toast.clearAll();
      toast.success("Operation completed successfully!");
    } catch (error) {
      toast.clearAll();
      toast.error("Operation failed");
    }
  };

  return <button onClick={handleAsyncOperation}>Start Processing</button>;
}

/**
 * Example 6: Multiple Sequential Toasts
 */
export function SequentialToastsExample() {
  const toast = useToast();

  const handleSync = () => {
    toast.info("Starting synchronization...");
    
    setTimeout(() => {
      toast.success("Data synced successfully!");
    }, 2000);
    
    setTimeout(() => {
      toast.success("Backup created!");
    }, 4000);
  };

  return <button onClick={handleSync}>Start Sync</button>;
}

/**
 * Example 7: Form Validation Errors
 */
export function FormValidationExample() {
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    
    if (errors.length > 0) {
      toast.error(errors.join(", "), {
        title: "Validation Failed"
      });
      return;
    }
    
    toast.success("Form submitted successfully!");
  };

  const validateForm = () => {
    const errors: string[] = [];
    // Add validation logic
    return errors;
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Submit</button>
    </form>
  );
}

/**
 * Example 8: Conditional Toast Based on State
 */
export function ConditionalToastExample() {
  const toast = useToast();
  const isOnline = true; // Replace with actual online status

  const handleSubmission = () => {
    if (isOnline) {
      toast.success("Submitted.", {
        title: "Success"
      });
    } else {
      toast.error("You are offline. Connect to the internet to submit.", {
        title: "No connection"
      });
    }
  };

  return <button onClick={handleSubmission}>Submit</button>;
}

/**
 * Example 9: Payment Confirmation
 */
export function PaymentConfirmationExample() {
  const toast = useToast();

  const handlePayment = async (amount: number, method: string) => {
    try {
      await processPayment(amount, method);
      
      toast.success(
        `$${amount.toFixed(2)} has been sent to your ${method}.`,
        { title: "Payment Successful" }
      );
    } catch (error) {
      toast.error("Payment processing failed. Please try again.", {
        title: "Payment Failed"
      });
    }
  };

  const processPayment = async (amount: number, method: string) => {
    // Payment processing logic
  };

  return <button onClick={() => handlePayment(50, "mobile money")}>Pay Now</button>;
}

/**
 * Example 10: Info Notification for Features
 */
export function FeatureInfoExample() {
  const toast = useToast();

  const handleFeatureClick = () => {
    toast.info("This feature is coming soon! Stay tuned for updates.");
  };

  return <button onClick={handleFeatureClick}>Coming Soon Feature</button>;
}
