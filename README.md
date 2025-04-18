# OwnChef - Recipe Sharing Platform 🍳

OwnChef is a modern, community-driven recipe sharing platform built with SvelteKit and PostgreSQL. Share your culinary creations, discover new recipes, and connect with food enthusiasts from around the world.

## 🌟 Features

### 🔥 For Users
- **Recipe Discovery**: Browse through a curated collection of recipes with detailed instructions
- **User Profiles**: Create your personal profile and share your culinary journey
- **Recipe Categories**: Easy navigation through different cuisine types and meal categories
- **Dark Mode**: Comfortable viewing experience with light/dark theme support
- **Responsive Design**: Perfect experience across all devices

### 👨‍🍳 For Creators
- **Recipe Creation**: Rich text editor for creating detailed recipes
- **Media Support**: Add images to showcase your dishes
- **Recipe Management**: Edit and manage your published recipes
- **Engagement Tracking**: See how your recipes perform

## 🚀 Tech Stack

- **Frontend**: 
  - SvelteKit
  - TailwindCSS
  - Lucide Icons
  - Rich Text Editor (Quill)

- **Backend**:
  - PostgreSQL
  - Drizzle ORM
  - Node.js

- **Authentication**:
  - Custom auth system
  - Session management
  - Social login support (Google, GitHub, Facebook)

## 🛠️ Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ownchef.git
   cd ownchef
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Create a .env file with the following variables
   DATABASE_URL="postgresql://user:password@localhost:5432/ownchef"
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   PUBLIC_URL="http://localhost:5173"
   ```

4. **Start the database**
   ```bash
   pnpm run db:start
   ```

5. **Run migrations**
   ```bash
   pnpm run db:push
   ```

6. **Start development server**
   ```bash
   pnpm run dev
   ```

## 📁 Project Structure

```
ownchef/
├── src/
│   ├── components/    # Reusable UI components
│   ├── routes/        # SvelteKit routes
│   ├── lib/          # Shared utilities and helpers
│   └── app.html      # App template
├── static/           # Static assets
├── drizzle.config.ts # Database configuration
└── README.md
```

## 🔑 Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run db:start` - Start PostgreSQL database
- `pnpm run db:push` - Push database changes
- `pnpm run db:studio` - Open Drizzle Studio

## 🎨 Features Details

### Authentication
- Email/Password login
- Social authentication (Google, GitHub, Facebook)
- Secure session management
- Protected routes

### Recipe Management
- Create, edit, and delete recipes
- Rich text editing
- Image upload support
- Recipe categorization

### User Interface
- Responsive design
- Dark/Light theme
- Modern UI components
- Interactive elements

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [SvelteKit](https://kit.svelte.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Lucide Icons](https://lucide.dev/)

## 📧 Contact

KarthikAkshaj - [@yourusername](https://github.com/KarthikAkshaj)

Project Link: [https://github.com/KarthikAkshaj/ownchef](https://github.com/KarthikAkshaj/ownchef)
