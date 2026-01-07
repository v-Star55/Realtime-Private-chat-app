# >private_chat

A secure, ephemeral, and minimalist real-time chat application built with Next.js and Elysia. Designed for privacy, every room has a limited lifespan and self-destructs after 10 minutes, ensuring no data persists.

## ✨ Key Features

- **Ephemeral Rooms**: All messages and metadata are permanently deleted when the room expires.
- **2-Person Limit**: Rooms are strictly limited to two participants for maximum privacy.
- **Secure Access Control**: A proxy layer ensures only authorized users can enter a room via a secure auth token.
- **Real-time Messaging**: Instant message delivery using `@upstash/realtime`.
- **Identity Anonymity**: Users are assigned random animal-based usernames upon entry.
- **Quick Destruction**: A dedicated "Destroy Now" button allowed for immediate room and data deletion.

## 🚀 Technical Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State & Data Fetching**: [@tanstack/react-query](https://tanstack.com/query/latest)
- **Icons & UI**: [React Spinners](https://www.davidhu.io/react-spinners/), [React Hot Toast](https://react-hot-toast.com/)

### Backend & Infrastructure
- **API Framework**: [Elysia](https://elysiajs.com/) (running within Next.js API routes)
- **Database**: [Redis](https://redis.io/) (via [@upstash/redis](https://upstash.com/))
- **Real-time**: [@upstash/realtime](https://upstash.com/docs/realtime)
- **Validation**: [Zod](https://zod.dev/)

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+ installed.
- An Upstash account for Redis and Realtime.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd chat_app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Upstash credentials:
   ```env
   UPSTASH_REDIS_REST_URL=your_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_redis_token
   NEXT_PUBLIC_UPSTASH_REALTIME_URL=your_realtime_url
   NEXT_PUBLIC_UPSTASH_REALTIME_TOKEN=your_realtime_token
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the results.

## 📁 Project Structure

- `src/app`: Next.js pages and API routes.
  - `api/[[...slugs]]`: Elysia backend implementation.
  - `room/[roomId]`: Real-time chat interface.
- `src/proxy.ts`: Middleware for room access control and capacity management.
- `src/lib`: Shared configurations for Redis, Realtime, and Elysia client.
- `src/hooks`: Custom React hooks (e.g., username generation).

## 🔒 Security & Privacy

- **Proxy Layer**: The application uses a custom proxy ([`src/proxy.ts`](file:///home/vaibhavchauhan/workspace/learning/chat_app/src/proxy.ts)) that checks room state in Redis before allowing access.
- **Capacity Enforcement**: Rooms are strictly limited to 2 active tokens.
- **Automatic TTL**: Redis hashes for rooms and messages have a strictly defined Time-To-Live (10 minutes), after which they are purged by the database.
- **No Persistence**: No long-term database is used. All conversations are stored exclusively in in-memory caches with short expiration.

---

Built with 💚 and focus on privacy.
