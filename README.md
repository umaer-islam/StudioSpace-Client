# StudioSpace — Frontend Client Application

StudioSpace is a full-stack marketplace platform connecting creative professionals (photographers, filmmakers, podcasters, and musicians) with verified creative workspace rentals.

**Live Application:** [https://studiospace23.vercel.app](https://studiospace23.vercel.app)  
**Backend API:** [https://studiospace-server-afsq.onrender.com](https://studiospace-server-afsq.onrender.com)  
**GitHub Client:** [https://github.com/umaer-islam/StudioSpace-Client](https://github.com/umaer-islam/StudioSpace-Client)  
**GitHub Server:** [https://github.com/umaer-islam/StudioSpace-Server](https://github.com/umaer-islam/StudioSpace-Server)

---

## 🌟 Features & Route Coverage

### Public Exploration
- **Homepage (`/`)**: Hero discovery, category carousels, how it works, curated studios, testimonials, and responsive navigation.
- **Studio Directory (`/studios`)**: Search by title/neighborhood, filter by category (Photo Studio, Film Stage, Podcast Lounge, Music Suite, Workshop), price sliders, and real-time sorting.
- **Studio Details (`/studios/[id]`)**: High-resolution gallery, amenities checklist, host profile, interactive calendar date/time picker, and server-side pricing calculator.

### Creator Workflow
- **Registration & Authentication (`/register`, `/login`)**: Better Auth session engine supporting both Email/Password and Google OAuth with secure HTTP-only cookies.
- **Booking Creation**: Real-time availability conflict checks, interactive duration selection, and transparent cost summaries.
- **My Bookings (`/my-bookings`)**: Live status tracking (`pending`, `confirmed`, `completed`, `cancelled`), reservation details, and self-service cancellation with reason prompts.

### Host Workflow
- **My Studio Listings (`/my-listings`)**: Dashboard to review all spaces owned by the Host, active/inactive statuses, direct links to edit or delete.
- **Add Studio (`/add-studio` & `/studios/new`)**: Form to publish new creative spaces with custom amenities, capacity, hourly rate, security deposit, address, and imagery.
- **Edit Studio (`/studios/edit/[id]`)**: Update existing studio details, adjust pricing, toggle availability status (`active`, `inactive`, `maintenance`).
- **Host Reservations (`/host-reservations`)**: Approve or decline incoming creator bookings, view creator contact details, and manage 24-hour pending expiration.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, Partial Prerendering)
- **UI Library**: React 19, Tailwind CSS v4
- **Icons**: Lucide React
- **Authentication**: Better Auth React Client (`better-auth/react`)
- **Theme**: `next-themes` (Dark / Light mode support)
- **Deployment**: Vercel

---

## 👥 Examiner Test Credentials

Examiners can register a new account on `/register` as either **Creator** or **Host**, or use the pre-configured demo credentials:

| Role | Email | Password | Allowed Actions |
| :--- | :--- | :--- | :--- |
| **Host** | `host.demo@studiospace.com` | `StudioPass123!` | Add studios, edit/delete listings, confirm reservations |
| **Creator** | `creator.demo@studiospace.com` | `StudioPass123!` | Explore studios, book slots, cancel bookings |

*(Or click **Continue with Google** to sign in with any valid Google account).*

---

## 🚀 Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/umaer-islam/StudioSpace-Client.git
   cd StudioSpace-Client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   INTERNAL_API_URL=http://localhost:5000
   ```

4. Run development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

5. Production build test:
   ```bash
   npm run lint
   npm run build
   ```
