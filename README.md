# 🏗️ PropKart Pre-Sales Portal (`pre-sales.nblisting`)

> **Official Pre-Sales Project Registration & Elevation Showcase Platform**  
> Engineered by **NB Property Technology Pvt Ltd** • Gujarat RERA Registered: `AG/GJ/AHMEDABAD/AHMEDABAD CITY/AA06870/170831R1`  
> Repository: [`pre-sales.nblisting`](https://github.com/propkartnbpropertytech-blip/pre-sales.nblisting)

---

## 🌟 Overview

The **PropKart Pre-Sales Portal** is a high-performance, responsive web application engineered for property developers, authorized project promoters, and tier-1 channel partners across Gujarat. It enables fast, standardized intake of upcoming residential towers, luxury villas, commercial corporate shell spaces, and plotted developments directly into the **PropKart** ecosystem.

When a project is submitted or approved, it instantaneously synchronizes across the ecosystem:
- **PropKart Listing (`listing.nbpropertytech.com`)**: Displays the project under the dedicated **Pre-sales** showcase with full elevation media, starting pricing metrics, and developer credential badges.
- **PropKart Operations Desk (`panel.nbpropertytech.com`)**: Full administrative lifecycle verification, telecaller history, and document validation.

```
┌─────────────────────────────────────────────────────────────────┐
│               PropKart Pre-Sales Portal                         │
│         https://github.com/propkartnbpropertytech-blip/        │
│                     pre-sales.nblisting                         │
│   • Builder Project Intake       • Gujarat RERA Compliance     │
│   • Media / Brochure Uploads     • Multi-unit Config & Pricing  │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Shared Backend & Hub                         │
│             Node.js / Express • PostgreSQL / Docker             │
│                 https://propconnect.nbpropertytech.com          │
└───────────────────────────────▲─────────────────────────────────┘
                                │
         ┌──────────────────────┴──────────────────────┐
         ▼                                             ▼
┌─────────────────────────────┐         ┌─────────────────────────────┐
│    PropKart Listing         │         │      PropKart Panel         │
│  (Public Showcase Portal)   │         │    (Operations Desk)        │
│  • Pre-sales / Rent / Sale  │         │  • Dynamic Schema Builder   │
│  • Elevation Cards          │         │  • Real-time Inventory Hub  │
└─────────────────────────────┘         └─────────────────────────────┘
```

---

## ✨ Features

- **100% Light Theme Minimalist UI**: Apple-inspired clean styling, responsive layouts, refined micro-animations, and dual-tone elevation typography.
- **Dynamic Form Schema Integration**: Automatically retrieves real-time field schemas from the Operations Desk backend (`/api/v1/presales/schema`), allowing admins to customize intake requirements dynamically without redeployment.
- **Gujarat RERA Verification**: Required official RERA registration number validation, possession timelines, and approved promoter credentials.
- **High-Resolution Media Uploads**: Built-in upload handles for architectural 3D renders, elevation photos, floor layout blueprints, and video walkthroughs.
- **Zero-Refresh Cross-Tab Reactivity**: Uses the browser's `BroadcastChannel('propkart_listing_channel')` API to communicate updates instantly across tabs.
- **Interactive Assistance Bar**: Synchronizes live support hotlines with the centralized Operations Desk.
- **Mobile First & Ultra Responsive**: Tailored for smooth operation across smartphones, tablets, laptops, and ultra-wide desktop monitors.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) + PostCSS
- **Icons**: [Lucide React](https://lucide.dev/)
- **CI/CD**: GitHub Actions + Hostinger VPS Deployment

---

## 💻 Local Development

### Prerequisites
- Node.js `>= 18.0.0`
- npm `>= 9.0.0`

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/propkartnbpropertytech-blip/pre-sales.nblisting.git
cd pre-sales.nblisting

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Start the local development server (Port 3006)
npm run dev

# 5. Production build and typecheck
npm run build

# 6. Preview production build locally
npm run preview
```

The application will be accessible locally at `http://localhost:3006`.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# Production API endpoint
VITE_API_URL=/api/v1

# Central Backend URL
VITE_BACKEND_URL=https://propconnect.nbpropertytech.com

# Public Listing Showcase URL
VITE_LISTING_URL=https://listing.nbpropertytech.com

# PropConnect Submission Gateway
VITE_PROPCONNECT_URL=https://propconnect.nbpropertytech.com
```

---

## 🚀 CI/CD & Hostinger VPS Deployment Guide

Automated deployments are powered by GitHub Actions in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Every push to `main` builds the optimized production bundle and securely syncs it to your Hostinger VPS via SSH.

### 1. Configure GitHub Secrets

Navigate to **GitHub Repository → Settings → Secrets and variables → Actions** and add the following repository secrets:

| Secret Name | Required | Description | Example / Default |
|---|---|---|---|
| `VPS_HOST` | **Yes** | Hostinger VPS Public IP or hostname | `185.199.xxx.xxx` |
| `VPS_USERNAME` | No | SSH username on VPS | `root` (default) |
| `VPS_SSH_KEY` | **Recommended** | OpenSSH Private Key (`~/.ssh/id_rsa` or `id_ed25519`) | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `VPS_SSH_PASSWORD`| Fallback | SSH user password (used if key not provided) | `<your-root-password>` |
| `VPS_PORT` | No | SSH port | `22` (default) |
| `VPS_PRESALES_PATH`| No | Target directory on VPS | `/var/www/pre-sales.nblisting` |

### 2. Hostinger VPS Server Setup (One-Time)

Log into your Hostinger VPS via terminal:

```bash
ssh root@<YOUR_VPS_IP>

# Create deployment directory
mkdir -p /var/www/pre-sales.nblisting
chown -R www-data:www-data /var/www/pre-sales.nblisting
chmod -R 755 /var/www/pre-sales.nblisting
```

### 3. Nginx Configuration for Hostinger VPS

Create or edit your Nginx site configuration (`/etc/nginx/sites-available/pre-sales.nblisting`):

```nginx
server {
    listen 80;
    server_name pre-sales.nblisting.com presales.nbpropertytech.com;

    root /var/www/pre-sales.nblisting;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss text/javascript;

    # Single Page Application routing fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets aggressively
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

Enable the site and test Nginx:
```bash
ln -s /etc/nginx/sites-available/pre-sales.nblisting /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 4. Enable Free SSL via Let's Encrypt (Certbot)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d pre-sales.nblisting.com -d presales.nbpropertytech.com
```

### 5. Automated CI/CD Trigger

Once GitHub Secrets are in place, any commit pushed to the `main` branch will automatically trigger `.github/workflows/deploy.yml`:
1. Checkout the latest commit
2. Install npm dependencies
3. Build the production Vite bundle with environment variables
4. Securely upload the bundle to `/var/www/pre-sales.nblisting/` on the Hostinger VPS
5. Set permissions and reload Nginx

You can also trigger manual deployments via the **Actions** tab by selecting **"Run workflow"**.

---

## 🏛️ Regulatory & Company Information

- **Company**: NB Property Technology Pvt. Ltd.
- **RERA Registration**: `AG/GJ/AHMEDABAD/AHMEDABAD CITY/AA06870/170831R1`
- **Location Focus**: Ahmedabad & Gujarat Prime Growth Corridors

---

## 📄 License

Proprietary © NB Property Technology Pvt Ltd. All rights reserved.
