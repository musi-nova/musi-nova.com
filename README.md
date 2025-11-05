# musi-nova.com
The musi-nova.com frontend.

## Getting Started
- `npm install` to install dependencies
- `npm run dev` to start the development server
- `npm run build` to build the project for production

- `npm install -g firebase-tools` to install Firebase CLI globally (if not already installed)
- `firebase login` to log in to Firebase
- `firebase deploy` to deploy the project to Firebase Hosting

## Notes
### General
- new payment page for credits (song submissions) - slider

### Song submission (to playlist) flow
- hero -> view all playlists -> payment -> success -> submit songs
- user pays for submission to our playlist
- user selects songs for playlists (submits)
- admin reviews submitted songs, approves/rejects songs for playlists

### Ad campaign running
- hero -> payment -> success -> create campaign
- user selects songs
- user submits playlist for review
- admin creates campaign based on submitted playlist