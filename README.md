This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

src/
├── app/               # Routes
│   ├── page.tsx       # Home page
│   ├── admin/         # Admin panel routes
│   └── products/      # Product display
├── components/        # Reusable UI components
├── lib/               # Utility functions (e.g. stripe.ts, email.ts)
├── styles/            # Tailwind + custom CSS
├── types/             # TypeScript interfaces and types
├── data/              # Temporary mock data (replace with DB later)
└── config/            # Configs like SEO, env constants, etc.


|                              | Server Component (default) | Client Component (`'use client'`) |
| ---------------------------: | -------------------------- | --------------------------------- |
|                   Runs on... | Server                     | Browser                           |
| Use `useState`, `useEffect`? | ❌                          | ✅                                 |
| Access cookies, DB, secrets? | ✅                          | ❌                                 |
| Needs `'use client'` at top? | ❌                          | ✅                                 |
|                     Examples | ProductPage, API route     | Buttons, forms, cart UI           |


layout.tsx auto-wraps everything

page.tsx gets inserted as {children}

Nav.tsx is a child of layout.tsx and shows on every page

Middleware Use Cases

    File: src/middleware.ts

    Runs before route is rendered

    Good for:

        Redirecting from /admin if not logged in

        Checking cookies / session auth

    Not needed for Stripe, API routes, or general content

export const config = {
  matcher: ['/admin/:path*'],
};

 Auth Strategy

    Store session/token in a cookie

    Middleware checks it

    Server routes use it to validate user

    Avoid calling client-side functions in server logic

    
 Dev Tips

    Use server components by default → faster, more SEO-friendly

    Only use 'use client' when absolutely necessary

    Don’t import functions from client components into server logic

    Keep logic separate:

        /components/client/ for UI

        /lib/ for DB/API helpers

        /app/api/ for secure server-side handlers
 reverse