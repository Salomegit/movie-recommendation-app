# MovieHub - Movie Recommendation App

A modern, responsive movie recommendation application built with Next.js, TypeScript, and Styled Components. Browse top-rated movies, save favorites, and explore detailed movie information.

## 🎬 Features

- **Browse Top 250 Movies**: Explore the highest-rated movies from IMDb
- **Dynamic Movie Details**: View comprehensive information including ratings, genres, cast, and production details
- **Favorites System**: Save your favorite movies locally with persistent storage
- **Real-time Search**: Filter movies by title, description, or genre
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Enhanced user experience with interactive hover effects and transitions

## 🚀 Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Styled Components**: CSS-in-JS styling solution
- **RapidAPI (IMDb)**: Movie data integration
- **Local Storage**: Client-side data persistence

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- RapidAPI account and IMDb API key

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

Update the API configuration in `lib/api.ts`:
```typescript
const RAPIDAPI_KEY = 'your-api-key-here';
const RAPIDAPI_HOST = 'imdb236.p.rapidapi1.com';
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
│   ├── MovieGrid.tsx         # Movie grid layout
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
```typescript
// lib/api.ts
export const movieApi = {
  getTop250Movies: () => apiFetch({ endpoint: '/imdb/top250-movies' }),
  getMovieDetails: (imdbId: string) => apiFetch({ endpoint: `/imdb/id/${imdbId}` }),
};
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

- `GET /imdb/top250-movies` - Fetch top 250 movies
- `GET /imdb/id/{imdbId}` - Get movie details
- `GET /imdb/search?query={query}` - Search movies
- `GET /imdb/most-popular-movies` - Get popular movies
- `GET /imdb/top-box-office` - Get box office hits

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Configure environment variables (API keys)
5. Deploy!

### Deploy to Netlify

1. Build the application:
```bash
npm run build
```

2. Deploy the `out` folder to Netlify

## 📝 Git Commit Convention

This project follows a structured commit message format:

- `feat:` New features
- `fix:` Bug fixes
- `style:` UI/styling changes
- `docs:` Documentation updates
- `refactor:` Code refactoring

Example:
```bash
git commit -m "feat: add movie search functionality"
git commit -m "style: improve movie card hover effects"
git commit -m "fix: resolve loading state issue"
```

## 🧪 Testing

Run type checking:
```bash
npm run type-check
```

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

Your Name - ProDev FE Challenge

## 🙏 Acknowledgments

- RapidAPI for IMDb data
- Next.js team for the amazing framework
- Styled Components for the styling solution