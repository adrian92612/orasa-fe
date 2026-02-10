---
trigger: always_on
---

1. React & Core Libraries
   └─ react, react-dom, react-router-dom, react-query, etc.
2. External UI / Component Libraries
   └─ e.g., @chakra-ui/react, @radix-ui/react, lucide-react, tailwind-variants, etc.
3. State Management & Context
   └─ Your hooks, context providers
   └─ e.g., @/context/UserContext, @/hooks/useBranches

4. Services / API Clients
   └─ API utilities, axios/fetch wrappers, service functions
   └─ e.g., @/services/branch.service, @/services/auth.service

5. Constants & Config
   └─ Static constants, enums, query keys, configuration
   └─ e.g., @/constants/queryKeys, @/constants/navigation

6. Types & Interfaces
   └─ TypeScript types, interfaces, zod schemas
   └─ e.g., @/types/branch, @/types/service, @/types/api

7. Utilities / Helpers
   └─ Generic utility functions
   └─ e.g., @/utils/formatters, @/utils/validators

8. Local Components (Feature-Level)
   └─ Reusable UI components within the same feature
   └─ e.g., @/components/ui/Button, @/components/ui/Dialog

9. Feature-Specific Modules
   └─ Components that belong to the current page/feature
   └─ e.g., @/components/features/dashboard/Sidebar, BranchSwitcher

10. Asset Imports
    └─ CSS, images, icons
    └─ e.g., import logo from "@/assets/logo.svg"; import "@/styles/global.css";

Rules / Best Practices

Always sort imports alphabetically within each group.

No side-effects imports at the top; side-effect imports (like CSS) should go last.

Type-only imports (import type { ... }) go with your Types & Interfaces group.

Feature-local imports after shared components/services.

Keep absolute imports (@/...) for project modules and relative imports (../) only for very local files.
