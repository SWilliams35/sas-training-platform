# SAS Team Training Platform

A centralized, real-time training module management system for the Physical Security & Safety team at DocuSign. Track course completions, manage certifications, and sync team progress instantly across all devices.

## Features

✅ **Centralized Data Storage** - All progress synced to PostgreSQL database  
✅ **Real-time Updates** - Changes instantly visible across all users  
✅ **Admin Dashboard** - See all team members' progress at a glance  
✅ **30 Pre-built Modules** - DESC Operator, SOP, Safety Training categories  
✅ **Progress Tracking** - Track completion %, status, and timestamps  
✅ **Free to Deploy** - Supabase + Render + Vercel (all free tiers)  
✅ **No Local-Only Limitation** - Everyone sees the same data  

## Getting Started

### Files Included
- **App.jsx, LoginPage.jsx, Dashboard.jsx** - React components (all in root)
- **App.css, LoginPage.css, Dashboard.css** - Styles
- **backend.js** - Node.js Express API
- **package.json** - Frontend dependencies
- **backend-package.json** - Backend dependencies (rename to package.json in /backend folder)
- **vite.config.js** - Vite bundler config
- **index.html, main.jsx** - React entry point
- **.env.example** - Environment variables template

### Quick Deploy (30 mins)

1. **Follow SETUP_GUIDE.md** (database setup)
2. **Follow DEPLOYMENT.md** (backend + frontend deployment)

That's it. You'll have a live, shareable URL.

## Tech Stack

- **Frontend:** React 18, Vite, CSS3
- **Backend:** Node.js, Express, JWT
- **Database:** Supabase (PostgreSQL, real-time)
- **Hosting:** Vercel (frontend), Render (backend)
- **Auth:** Email/password + JWT

## Modules (30 Total)

- **DESC Operator (8)** - Basics, Role, Systems, Operations, Advanced, Incident, Escalations, Reporting
- **SOP Training (8)** - Overview, Procedures 1-2, Access Control, Incident, Documentation, Best Practices, Advanced
- **Safety Training (14)** - Basics, Building Access, Emergency, Fire, Active Threats, Evacuation, Medical, Badge, Lock Down, First Aid, Communication, Awareness, Vendor, Compliance

## Admin Features

As `steven.williams@docusign.com`, you can:
- View all team members' progress in real-time
- See completion dates and timestamps
- Edit module titles/descriptions
- Push updates to all users instantly

## Next Steps

1. Create new GitHub repo
2. Upload all frontend files to **root**
3. Upload backend files to **/backend** folder
4. Follow SETUP_GUIDE.md and DEPLOYMENT.md

---

**Built for the Physical Security & Safety team at DocuSign.**
