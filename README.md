# Glam Wholesale — Full Stack E-Commerce Platform

India's Premier Wholesale Accessories E-Commerce Website built with Next.js 14.

## 🚀 Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** NextAuth.js (Credentials Provider)
- **State:** Zustand (Cart)
- **File Upload:** Cloudinary
- **Hosting:** Vercel (frontend) + Neon/Railway (PostgreSQL)

## 📋 Setup Instructions

### 1. Clone & Install

```bash
cd glam-wholesale
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in the values:

```env
DATABASE_URL="postgresql://user:password@host:5432/glamwholesale"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
```

### 3. Database Setup

```bash
npx prisma db push
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### 5. Admin Login

See `.env.example` for setup. Default seed credentials are in `prisma/seed.ts`.

## 🎨 Color Theme

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#E91E8C` | Deep pink — buttons, links |
| Secondary | `#FF6EB4` | Soft pink — accents |
| Accent | `#FFD700` | Gold — badges, highlights |
| Background | `#FFF5F9` | Blush white — page bg |
| Dark | `#1A0010` | Deep maroon black — text, admin |

## 📁 Project Structure

```
glam-wholesale/
├── prisma/              # Schema & seed
├── src/
│   ├── app/
│   │   ├── (public)/    # Public-facing pages
│   │   ├── admin/       # Admin dashboard pages
│   │   └── api/         # API route handlers
│   ├── components/      # Reusable components
│   ├── lib/             # Prisma, auth, utils
│   ├── store/           # Zustand cart store
│   └── types/           # TypeScript declarations
├── middleware.ts         # Auth protection
└── tailwind.config.ts   # Theme configuration
```

## 🔑 Key Features

- ✅ Full product catalog with category filtering
- ✅ Wholesale MOQ enforcement (12 pieces minimum)
- ✅ Guest & logged-in checkout
- ✅ WhatsApp ordering integration
- ✅ Admin dashboard with statistics
- ✅ Complete CRUD for products, categories, orders
- ✅ Customer approval system
- ✅ Cloudinary image upload
- ✅ CSV export for orders
- ✅ Mobile responsive design
- ✅ INR (₹) currency throughout

## 📝 Business Rules

1. MOQ is strictly 12 pieces per product
2. Cart quantities must always be multiples of 12
3. If quantity is not a multiple of 12, it auto-rounds up
4. Guest checkout is allowed (no forced login)
5. Shipping is India-only
6. Admin accounts can only be created via seed or direct DB
