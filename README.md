# [Beef with Bezos](https://www.beefwithbezos.com)

A public tracker for Amazon missed deliveries. Because someone needs to keep count. https://www.beefwithbezos.com

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom `rage` color palette
- **Animations**: Framer Motion
- **Database**: Vercel KV (Redis) in production, in-memory storage for local dev
- **Auth**: Cookie-based admin authentication
- **Language**: TypeScript

## Features

- Public counter displaying total missed deliveries
- Detailed list of each missed delivery with dates and notes
- Admin panel for authenticated users to report new incidents
- Responsive design with animated UI elements

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd beef-with-bezos

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `KV_REST_API_URL` | Vercel KV REST API URL | No (uses in-memory for local dev) |
| `KV_REST_API_TOKEN` | Vercel KV REST API token | No (uses in-memory for local dev) |
| `ADMIN_PASSWORD` | Password for admin access | No (defaults to `bezos123` locally) |

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── admin/          # Protected admin endpoints
│   │   │   ├── add/        # POST - Add missed delivery
│   │   │   ├── check/      # GET - Check auth status
│   │   │   ├── delete/     # DELETE - Remove delivery
│   │   │   ├── login/      # POST - Admin login
│   │   │   └── logout/     # POST - Admin logout
│   │   └── misses/         # GET - Public missed deliveries list
│   ├── admin/              # Admin panel page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx            # Home page (server component)
├── components/
│   ├── AddMissForm.tsx     # Form to add new incidents
│   ├── Counter.tsx         # Animated counter display
│   ├── HomeContent.tsx     # Client-side home content
│   ├── MissCard.tsx        # Individual delivery card
│   └── SarcasticTagline.tsx
├── lib/
│   ├── auth.ts             # Authentication helpers
│   └── kv.ts               # Vercel KV / in-memory storage
└── types/
    └── index.ts            # TypeScript interfaces
```

## API Routes

### Public

- `GET /api/misses` - Returns array of all missed deliveries

### Admin (requires authentication)

- `POST /api/admin/login` - Authenticate with admin password
- `POST /api/admin/logout` - Clear authentication
- `GET /api/admin/check` - Verify authentication status
- `POST /api/admin/add` - Add a new missed delivery
- `DELETE /api/admin/delete` - Remove a missed delivery

## Deployment

Deploy to Vercel for the best experience:

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Create a KV database in Vercel Dashboard
4. Add environment variables
5. Deploy

## License

MIT
