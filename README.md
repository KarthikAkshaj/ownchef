# OwnChef - Recipe Sharing Platform 🍳

> A modern, feature-rich recipe sharing platform where food enthusiasts share their culinary creations, discover new recipes, and connect with a vibrant community of home cooks and professional chefs.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![SvelteKit](https://img.shields.io/badge/SvelteKit-5.0-FF3E00?logo=svelte)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-4169E1?logo=postgresql)

## ✨ Features

### 🔥 For Food Lovers
- **Recipe Discovery**: Browse thousands of recipes with advanced filtering by cuisine, category, difficulty, and dietary preferences
- **Interactive Recipe Cards**: Beautiful, responsive recipe cards with images, ratings, and key information
- **Detailed Recipe Pages**: Step-by-step instructions, ingredient lists with serving adjustments, nutrition info, and pro tips
- **Cooking Mode**: Hands-free, step-by-step cooking mode perfect for following recipes while cooking
- **Advanced Search**: Find recipes by ingredients, cuisine type, cooking time, and more
- **Save & Bookmark**: Save your favorite recipes for quick access
- **Rate & Review**: Share your experience and help others discover great recipes

### 👨‍🍳 For Recipe Creators
- **Rich Recipe Editor**: Create beautiful recipes with our intuitive editor
- **Ingredient Grouping**: Organize ingredients into logical groups (e.g., "For Marinade", "For Sauce")
- **Step-by-Step Instructions**: Add detailed cooking steps with optional images and timing
- **Pro Tips & Variations**: Share chef tips, storage advice, substitutions, and variations
- **Image Upload**: Upload recipe images to Cloudflare R2 (CDN-powered, fast delivery)
- **Recipe Management**: Edit, update, or delete your recipes anytime
- **Draft System**: Save recipes as drafts and publish when ready

### 👤 User Profiles
- **Personal Profile**: Customizable profile with bio, location, website, and profile picture
- **Recipe Portfolio**: Showcase all your published recipes
- **Profile Statistics**: Track followers, recipes count, and engagement
- **Social Integration**: Google OAuth authentication for quick sign-up

### 🎨 User Experience
- **Dark Mode**: Beautiful dark theme with smooth transitions
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Accessibility**: WCAG compliant with proper semantic HTML and ARIA labels

## 🚀 Tech Stack

### Frontend
- **SvelteKit 5.0** - Modern, reactive web framework with server-side rendering
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework with custom design system
- **Lucide Icons** - Beautiful, consistent iconography
- **Quill** - Rich text editor for recipe descriptions
- **Swiper** - Touch-enabled image carousels

### Backend
- **PostgreSQL** - Robust, ACID-compliant relational database
- **Drizzle ORM** - Type-safe ORM with excellent developer experience
- **Node.js** - JavaScript runtime
- **Docker** - Containerized database for easy development

### Authentication & Security
- **Custom Auth System** - Secure session-based authentication
- **Google OAuth** - Social login integration
- **Argon2** - Password hashing with @node-rs/argon2
- **Session Management** - Secure, httpOnly cookies with CSRF protection

### Cloud & Storage
- **Cloudflare R2** - S3-compatible object storage for images (10GB free, unlimited egress!)
- **AWS SDK** - S3-compatible API for R2 integration

## 📦 Installation

### Prerequisites
- Node.js 18+ or Bun
- Docker & Docker Compose (for PostgreSQL)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/KarthikAkshaj/ownchef.git
   cd ownchef
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   ```env
   # Database
   DATABASE_URL="postgres://root:mysecretpassword@localhost:5432/local"

   # Cloudflare R2 Storage (see R2_SETUP_GUIDE.md)
   R2_ACCOUNT_ID="your-cloudflare-account-id"
   R2_ACCESS_KEY_ID="your-r2-access-key-id"
   R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
   R2_BUCKET_NAME="ownchef-uploads"
   R2_PUBLIC_URL="https://your-bucket-url.r2.dev"

   # Optional: Google OAuth (for social login)
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   PUBLIC_URL="http://localhost:5173"
   ```

4. **Start the PostgreSQL database**
   ```bash
   npm run db:start
   # or
   docker-compose up -d
   ```

5. **Push database schema**
   ```bash
   npm run db:push
   ```

6. **Seed the database** (optional, adds sample data)
   ```bash
   npm run db:seed
   ```

   Test credentials after seeding:
   - Username: `chef_yuki`
   - Password: `password123`

7. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser!

## 🗂️ Project Structure

```
ownchef/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AuthLinks/       # Authentication UI
│   │   ├── Comments/        # Comment system
│   │   ├── CookingMode/     # Interactive cooking mode
│   │   ├── Navbar/          # Navigation bar
│   │   └── Footer/          # Footer component
│   ├── routes/              # SvelteKit routes (file-based routing)
│   │   ├── (auth)/          # Auth routes (login, signup)
│   │   ├── api/             # API endpoints
│   │   │   ├── recipes/     # Recipe CRUD operations
│   │   │   └── upload/      # File upload to R2
│   │   ├── profile/         # User profiles
│   │   │   ├── [username]/  # Dynamic user profile
│   │   │   └── edit/        # Profile editing
│   │   ├── recipes/         # Recipe pages
│   │   │   └── [slug]/      # Dynamic recipe detail
│   │   ├── category/        # Category browsing
│   │   ├── write/           # Recipe creation/editing
│   │   └── +layout.svelte   # Root layout
│   ├── lib/                 # Shared code
│   │   ├── server/          # Server-side code
│   │   │   ├── auth.ts      # Authentication logic
│   │   │   ├── storage.ts   # R2 storage utilities
│   │   │   └── db/          # Database schema & config
│   │   └── stores/          # Svelte stores (theme, etc.)
│   └── app.html             # HTML template
├── static/                  # Static assets (images, fonts)
├── docker-compose.yml       # PostgreSQL container config
├── drizzle.config.ts        # Drizzle ORM configuration
├── tailwind.config.js       # TailwindCSS configuration
├── .env.example             # Environment variables template
├── R2_SETUP_GUIDE.md        # Cloudflare R2 setup instructions
└── README.md                # You are here!
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (with HMR) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run check` | Run TypeScript & Svelte checks |
| `npm run format` | Format code with Prettier |
| `npm run lint` | Lint code with ESLint |
| `npm run db:start` | Start PostgreSQL database (Docker) |
| `npm run db:push` | Push schema changes to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |
| `npm run db:seed` | Seed database with sample data |

## 📊 Database Schema

### Core Tables
- **users** - User accounts with profiles
- **sessions** - Authentication sessions
- **recipes** - Recipe records with metadata
- **recipe_ingredients** - Ingredients with grouping support
- **recipe_instructions** - Step-by-step cooking instructions
- **recipe_tips** - Chef tips, storage advice, variations
- **categories** - Recipe categories (Appetizers, Main Course, etc.)
- **cuisines** - Cuisine types (Indian, Chinese, Italian, etc.)
- **tags** - Flexible tagging system
- **recipe_ratings** - User ratings and reviews
- **recipe_likes** - Recipe likes/favorites

See `src/lib/server/db/schema.ts` for complete schema definition.

## 🔐 Authentication

OwnChef uses a hybrid authentication system:

1. **Email/Password** - Traditional authentication with Argon2 password hashing
2. **Google OAuth** - Quick sign-up with Google account
3. **Session Management** - Secure, httpOnly cookies with automatic renewal

All routes under `/profile/*` and `/write` require authentication.

## 📤 File Uploads

Images are stored in **Cloudflare R2** (S3-compatible storage):

- ✅ 10GB free storage
- ✅ Unlimited bandwidth (no egress fees!)
- ✅ Global CDN for fast delivery
- ✅ S3-compatible API

**Setup Instructions**: See [R2_SETUP_GUIDE.md](./R2_SETUP_GUIDE.md)

Supported formats: JPG, PNG, WebP, GIF (max 5MB per file)

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Code Style
- Use Prettier for formatting (`npm run format`)
- Follow ESLint rules (`npm run lint`)
- Write descriptive commit messages
- Document new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with amazing open-source tools:

- [SvelteKit](https://kit.svelte.dev/) - The web framework
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe database toolkit
- [PostgreSQL](https://www.postgresql.org/) - Reliable database
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- [Cloudflare R2](https://www.cloudflare.com/products/r2/) - Object storage
- [Quill](https://quilljs.com/) - Rich text editor
- [Swiper](https://swiperjs.com/) - Touch slider

## 📧 Contact & Support

**Developer**: Karthik Akshaj

- GitHub: [@KarthikAkshaj](https://github.com/KarthikAkshaj)
- Project: [github.com/KarthikAkshaj/ownchef](https://github.com/KarthikAkshaj/ownchef)

---

<div align="center">
  <strong>Made with ❤️ and lots of ☕</strong>
  <br>
  <sub>Happy cooking! 🍳</sub>
</div>
