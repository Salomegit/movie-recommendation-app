# MovieHub - Movie Recommendation App

A modern, responsive movie recommendation application built with Next.js, TypeScript, and The Movie Database (TMDB) API.

## 🎬 Features

- **Discover movies**: Explore the highest-rated movies from TMDB
- **Dynamic Movie Details**: View comprehensive information including ratings, genres, cast, and production details
- **Favorites System**: Save your favorite movies locally with persistent storage
- **Real-time Search**: Filter movies by genre
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Enhanced user experience with interactive hover effects and transitions

## 🚀 Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Styled Components**: Clean styling solution
- **TMDB API**: Movie data and images
- **Local Storage**: Client-side data persistence

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- TMDB API account and IMDb API key

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd movie-recommendation-app
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up API credentials**

Update the API configuration in `.env.local`:
```
NEXT_PUBLIC_TMDB_ACCESS_TOKEN=your_token_here

```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
movie-recommendation-app/
├── app/
│   ├── favorites/
│   │   └── page.tsx          # Favorites page
│   ├── movies/
│   │   └── [id]/
│   │       └── page.tsx      # Dynamic movie detail page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── registry.tsx          # Styled Components registry
├── components/
│   ├── MovieCard.tsx         # Movie card component
│   ├── MovieGrid.tsx  
|   ├── GenreFilter.tsx   # Movie grid layout
│   ├── Navbar.tsx            # Navigation bar
│   └── SearchBar.tsx         # Search component
├── lib/
│   ├── api.ts                # API integration
│   └── storage.ts            # Local storage utilities
├── types/
│   └── movie.ts              # TypeScript type definitions
└── package.json
```

## 🎯 Key Features Implementation

### Dynamic Routing
```typescript
// app/movies/[id]/page.tsx
export default function MovieDetailPage() {
  const params = useParams();
  // Load movie based on dynamic ID
}
```

### Local Storage for Favorites
```typescript
// lib/storage.ts
export const storage = {
  getFavorites: (): FavoriteMovie[] => { /* ... */ },
  addFavorite: (movie: FavoriteMovie): boolean => { /* ... */ },
  removeFavorite: (movieId: string): boolean => { /* ... */ },
};
```

### API Integration
```
/discover/movie - Browse popular movies
/movie/{id} - Get movie details
/movie/{id}/similar - Get similar movies
/genre/movie/list - Get all genres
```

## 🎨 Styling

The app uses Styled Components for styling with a modern dark theme:

- **Primary Color**: `#e50914` (Netflix red)
- **Background**: `#0a0a0a` (Dark)
- **Text**: `#ffffff` (White)
- **Accent**: `#ffd700` (Gold for ratings)

## 📱 Responsive Breakpoints

- **Desktop**: > 968px
- **Tablet**: 768px - 968px
- **Mobile**: < 768px

## 🔑 API Endpoints Used

- /discover/movie – Popular movies

- /movie/{id} – Movie details

- /movie/{id}/similar – Similar movies

- /genre/movie/list – All genres

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Configure environment variables (API keys)
5. Deploy!


Build for production:
```bash
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Salome Githinji - ProDev FE Challenge

