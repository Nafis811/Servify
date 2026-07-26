# Migration Map

This map records the module-level translation from CodeIgniter 4 into the new Node.js + TypeScript stack.

## Authentication

- CI4 controller layer -> `backend/src/modules/auth/auth.controller.ts`
- CI4 session and model logic -> `backend/src/modules/auth/auth.repository.ts` and `backend/src/modules/auth/auth.service.ts`
- CI4 login/register views -> `frontend/src/pages/LoginPage.tsx` and `frontend/src/pages/RegisterPage.tsx`
- Session persistence helpers -> `frontend/src/features/auth/auth.session.ts`
- Session guard / auth middleware -> `backend/src/shared/middlewares/auth-guard.ts`

## Navbar and landing

- CI4 home controller and partial view -> `backend/src/modules/landing/landing.controller.ts` and `frontend/src/components/Navbar.tsx`
- CI4 landing payload -> `backend/src/modules/landing/landing.service.ts`
- Home page view -> `frontend/src/pages/HomePage.tsx`
- Navbar data route -> `backend/src/modules/landing/landing.routes.ts` and `frontend/src/features/landing/landing.api.ts`

## Marketplace

- CI4 marketplace controller -> `backend/src/modules/marketplace/marketplace.controller.ts`
- CI4 marketplace model and query logic -> `backend/src/modules/marketplace/marketplace.repository.ts` and `backend/src/modules/marketplace/marketplace.service.ts`
- Marketplace listing UI -> `frontend/src/pages/MarketplacePage.tsx`
- Product detail UI -> `frontend/src/pages/ProductDetailPage.tsx`
- Marketplace API helpers -> `frontend/src/features/marketplace/marketplace.api.ts`

## Data strategy in this phase

- Backend auth and marketplace data are backed by in-memory repositories.
- Frontend seed arrays are used only as fallback data if the API is unavailable.
- This keeps the migration moving while the original CodeIgniter database layer is mapped back in the next phase.

## Deferred modules

- Admin and all admin-side CRUD flows remain untouched.
- Merchant, reservation, chatbot, and location modules remain untouched.

## Business logic preserved in this phase

- Login and register flow
- Session issuing and current-user lookup
- Marketplace browsing, search, and product detail flow
- Home and navbar content flow
