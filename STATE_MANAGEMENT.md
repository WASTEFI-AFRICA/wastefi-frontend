# State Management & API Documentation

## Architecture Overview

WasteFi uses a modern, efficient state management approach optimized for mobile-first applications:

- **Zustand**: Lightweight global state management
- **React Query**: Server state caching and synchronization
- **Local Storage**: Persistence for authentication and offline support

## State Management

### Zustand Stores

#### 1. Auth Store (`store/authStore.ts`)

Manages user authentication state.

```tsx
import { useAuthStore } from "@/store/authStore";

function MyComponent() {
  const { user, isAuthenticated, setAuth, logout } = useAuthStore();
  
  // Login
  setAuth(userData, token);
  
  // Logout
  logout();
  
  // Check auth status
  if (!isAuthenticated) {
    // Redirect to login
  }
}
```

**State:**
- `user`: Current user object or null
- `token`: JWT token or null
- `isAuthenticated`: Boolean authentication status
- `isLoading`: Loading state for auth operations

**Actions:**
- `setAuth(user, token)`: Set authenticated user and token
- `logout()`: Clear authentication state
- `updateUser(partial)`: Update user profile
- `setLoading(boolean)`: Set loading state

#### 2. Wallet Store (`store/walletStore.ts`)

Manages wallet balance and transactions.

```tsx
import { useWalletStore } from "@/store/walletStore";

function WalletComponent() {
  const { wallet, transactions, setWallet, addTransaction } = useWalletStore();
  
  return (
    <div>
      <p>Balance: ${wallet?.balance}</p>
      <p>Transactions: {transactions.length}</p>
    </div>
  );
}
```

**State:**
- `wallet`: Wallet data or null
- `transactions`: Array of transactions
- `isLoading`: Loading state
- `error`: Error message or null

**Actions:**
- `setWallet(wallet)`: Set wallet data
- `setTransactions(transactions)`: Set transaction list
- `addTransaction(transaction)`: Add new transaction
- `updateBalance(amount)`: Update wallet balance
- `reset()`: Clear wallet state

#### 3. UI Store (`store/uiStore.ts`)

Manages global UI state (modals, toasts, connectivity).

```tsx
import { useUIStore } from "@/store/uiStore";

function MyComponent() {
  const { isOnline, addToast, openModal } = useUIStore();
  
  // Show toast
  addToast("Success!", "success");
  
  // Open modal
  openModal("confirmDialog");
  
  // Check connectivity
  if (!isOnline) {
    // Show offline message
  }
}
```

**State:**
- `isOnline`: Network connectivity status
- `isSidebarOpen`: Sidebar visibility
- `activeModal`: Currently open modal ID
- `toasts`: Array of toast notifications
- `isGlobalLoading`: Global loading overlay

**Actions:**
- `setOnline(boolean)`: Update connectivity status
- `toggleSidebar()`: Toggle sidebar
- `openModal(id)`: Open specific modal
- `closeModal()`: Close active modal
- `addToast(message, type, duration)`: Show toast notification
- `removeToast(id)`: Remove specific toast

## API Client

### Configuration (`lib/api/client.ts`)

The API client is built on Axios with interceptors for authentication and error handling.

```tsx
import { api } from "@/lib/api/client";

// GET request
const data = await api.get<User>("/users/me");

// POST request
const result = await api.post<AuthResponse>("/auth/login", {
  phone: "+1234567890",
  password: "secret"
});

// PUT request
const updated = await api.put<User>("/users/profile", {
  name: "New Name"
});

// DELETE request
await api.delete("/users/account");
```

**Features:**
- Automatic JWT token injection from localStorage
- 30-second timeout for low-bandwidth environments
- Automatic 401 handling and redirect to login
- Typed responses with TypeScript generics
- Custom error handling with `APIError` class

### Request Interceptors

1. **Authentication**: Automatically adds `Authorization: Bearer {token}` header
2. **Error Handling**: Handles 401 (unauthorized), network errors, and timeouts

### Error Handling

```tsx
import { api, APIError } from "@/lib/api/client";

try {
  const data = await api.get("/protected-route");
} catch (error) {
  if (error instanceof APIError) {
    console.log(error.message); // User-friendly message
    console.log(error.status);  // HTTP status code
    console.log(error.data);    // Response data
  }
}
```

## React Query

### Provider Setup

The `QueryProvider` is configured in `lib/providers/QueryProvider.tsx` and wrapped around the app in `app/layout.tsx`.

**Configuration:**
- `staleTime`: 5 minutes (reduces unnecessary refetches)
- `gcTime`: 10 minutes (cache persistence)
- `retry`: 2 attempts for queries, 1 for mutations
- `refetchOnWindowFocus`: Disabled (mobile optimization)

### Usage Example

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { Wallet } from "@/types/api";

function WalletComponent() {
  const queryClient = useQueryClient();
  
  // Fetch wallet data
  const { data: wallet, isLoading, error } = useQuery({
    queryKey: ["wallet"],
    queryFn: () => api.get<Wallet>("/wallet"),
  });
  
  // Cashout mutation
  const cashoutMutation = useMutation({
    mutationFn: (amount: number) => 
      api.post("/wallet/cashout", { amount }),
    onSuccess: () => {
      // Invalidate and refetch wallet
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
  
  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {wallet && <p>Balance: ${wallet.balance}</p>}
      
      <button onClick={() => cashoutMutation.mutate(100)}>
        Cash Out $100
      </button>
    </div>
  );
}
```

## Type Definitions

All API types are defined in `types/api.ts`:

- `User`, `AuthResponse`, `LoginRequest`, `RegisterRequest`
- `WasteSubmission`, `CreateWasteSubmissionRequest`, `MaterialType`
- `CollectionPoint`
- `Wallet`, `Transaction`, `CashoutRequest`
- `ImpactStats`
- `PaginatedResponse<T>`, `ApiResponse<T>`, `ApiError`

```tsx
import type { User, Wallet, WasteSubmission } from "@/types/api";
```

## Routing Structure

### App Router Organization

```
app/
├── (auth)/              # Authentication routes (grouped layout)
│   ├── layout.tsx       # Centered auth layout
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
│
├── (collector)/         # Collector-specific routes
│   ├── layout.tsx       # Collector layout with navigation
│   ├── dashboard/
│   │   └── page.tsx
│   ├── submit/
│   │   └── page.tsx
│   └── wallet/
│       └── page.tsx
│
├── (collection-point)/  # Collection point routes
│   └── dashboard/
│       └── page.tsx
│
├── (admin)/             # Admin routes
│   └── dashboard/
│       └── page.tsx
│
├── layout.tsx           # Root layout with QueryProvider
└── page.tsx             # Home/landing page
```

### Route Groups

Parentheses in folder names `(group)` create route groups without affecting the URL structure:

- `/login` (not `/auth/login`)
- `/dashboard` (not `/collector/dashboard`)

### Navigation

```tsx
import { useRouter } from "next/navigation";

function MyComponent() {
  const router = useRouter();
  
  // Navigate to dashboard
  router.push("/dashboard");
  
  // Navigate with replace (no history)
  router.replace("/login");
  
  // Go back
  router.back();
}
```

## Environment Variables

Create `.env.local` based on `.env.example`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true
```

Access in code:
```tsx
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## Best Practices

1. **Use Zustand for UI state**: Auth, wallet, UI preferences
2. **Use React Query for server state**: API data, caching, synchronization
3. **Type everything**: Use TypeScript types from `types/api.ts`
4. **Handle errors gracefully**: Use try-catch with APIError
5. **Optimize for mobile**: Use appropriate staleTime and caching
6. **Test offline scenarios**: Handle network failures gracefully

## Next Steps

Phase 2 will implement:
- Complete authentication flow
- Wallet dashboard with real data
- Waste submission form
- Collection point finder
- Offline queue for submissions
