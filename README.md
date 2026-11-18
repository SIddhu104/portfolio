# Premium 3D Full-Stack Developer Portfolio & Admin CMS

A high-performance, futuristic 3D personal developer portfolio and content management system engineered for **Siddhesh Korade** — Full-Stack Developer, MERN Stack Specialist, and Next.js Web Architect.

Designed faithfully after high-end Awwwards-style developer portfolios and modern agency showcases, featuring pitch-black aesthetics, neon cyan/purple accents, glassmorphic cards, directory-style interactive tables, custom desktop cursor effects, and an interactive **Three.js WebGL 3D scene**.

---

## 🚀 Key Features

### 1. 3D WebGL & Visual Experience
- **Interactive Three.js Hero Scene**: Holographic icosahedron core with glowing cyber rings, orbiting satellite nodes, mouse-movement parallax, and responsive particle field.
- **Background Constellation Canvas**: Ambient interactive particle grid with gentle float animations.
- **Custom Desktop Cursor**: Trailing glow aura that expands when hovering interactive elements, links, and project cards.
- **Design Alignment**: Clean typography (`Full-stack Developer`), capsule pills, Bento-grid tech stack layout, and inverted hover directory rows in the `Work` section.

### 2. Public Sections & Live Experience
- **Hero Section**: Typographic layout with animated typing roles, download resume CTA, social pills (GitHub, LinkedIn, Email), and 3 featured project cards matching the reference design.
- **About Me & Bento Tech Grid**: Categorized tech stack (Frontend, Backend, Database, Tools & Security) with avatar frame and career metrics.
- **Projects Showcase**: Filterable by category (*MERN Stack*, *Next.js*, *AI / Gen-AI*, *Full Stack*), featuring live links, repository buttons, and interactive deep-dive modal.
- **Work Directory Table**: Sleek interactive rows that invert on hover (white background with black text) displaying internships (*Webisoftech*), degrees (*M.C.A.*, *B.C.A.*), and certifications (*Oak Academy*).
- **Services Grid**: 6 core engineering offerings.
- **Contact Form**: Real-time form validation, MongoDB storage, Resend email notification trigger, rate limiting, and celebratory confetti animation upon transmission.

### 3. Private & Secure Admin CMS (`/admin`)
- **Hidden Admin Access**: Routes protected by server-side JWT verification, HTTP-only cookies, and excluded from search engine indexing via `robots.txt` (`noindex`).
- **One-Time Restricted Registration** (`/admin/register`): Protected by `ADMIN_SETUP_SECRET`. Once the primary administrator is created, public registration is permanently disabled.
- **Secure Authentication** (`/admin/login`): Password hashing with `bcryptjs`, remember session toggle, and rate limiting.
- **Full-Featured Dashboard** (`/admin/dashboard`):
  - **Overview**: Real-time counts for total projects, published, drafts, skills, and unread inquiries.
  - **Profile Management**: Update name, bio, social links, location, and resume PDF URL.
  - **Project Management**: Full CRUD (Create, Edit, Delete, Toggle Publish/Draft, Tech tags, Features, Live/Repo URLs).
  - **Skill Management**: Adjust categories, proficiency levels, and display ordering.
  - **Work & Timeline Management**: Edit internships, degrees, and certifications.
  - **Messages Inbox**: View visitor inquiries, toggle read status, reply via email, or delete messages.
  - **Website Settings**: Configure site SEO title, meta description, accent theme, and resume file name.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React, Three.js, Canvas Confetti |
| **Backend** | Next.js Route Handlers, Node.js |
| **Database** | MongoDB Atlas, Mongoose ODM (with automatic resilient fallback & auto-seeding) |
| **Authentication** | JWT (`jsonwebtoken`), `bcryptjs`, HTTP-only secure cookies |
| **Deployment** | Vercel (Frontend & Serverless Functions), MongoDB Atlas (Cloud Database) |

---

## 📦 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/siddheshkorade/portfolio.git
cd portfolio
npm install
```

### 2. Configure Environment Variables

Create `.env.local` using the template below:

```bash
# MongoDB Connection String (Atlas or Local)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority

# JWT Token Secret
JWT_SECRET=super_secret_jwt_key_siddhesh_portfolio_2026_xyz987

# Initial Admin Registration Secret Key
ADMIN_SETUP_SECRET=admin_secret_setup_key_2026

# Email Integration (Optional - Resend API)
RESEND_API_KEY=re_123456789_abcdef

# Contact Notifications Email
CONTACT_RECEIVER_EMAIL=siddheshkorade10@gmail.com

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the portfolio.

---

## 🔐 Admin Setup & First-Time Login

1. Navigate directly to `http://localhost:3000/admin/register`.
2. Enter your Full Name, Email, Password, and your `ADMIN_SETUP_SECRET` (configured in `.env.local`).
3. Once registered, log into the dashboard at `http://localhost:3000/admin/login`.
4. Update projects, skills, or resume information anytime without touching code!

---

## 🚢 Deployment to Vercel

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Add the environment variables (`MONGODB_URI`, `JWT_SECRET`, `ADMIN_SETUP_SECRET`, `CONTACT_RECEIVER_EMAIL`).
4. Click **Deploy**. Vercel will build and optimize your static and dynamic routes automatically.
