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

## Video compression
We use [ffmpeg](https://ffmpeg.org/) to compress videos before uploading them to cloudinary.

```
ffmpeg -i ~/Downloads/Nick Testimonial #7.mp4 \
-c:v libx264 \
-crf 26 \
-preset slow \
-c:a aac \
-b:a 128k \
-movflags +faststart \
jay_testimonial.mp4
```

### New Payment flow
- hero -> pricing -> track selection + email -> payment -> success -> dashboard

track selection copy:
```
Please list all your songs that you want in the playlist.

List them from most to least important

(All your songs are important to us of course, but the higher they are ranked the more streams they will get)

We will blend your songs in with popular music within your genre, so people will love the playlist, and your music will be discovered as a result.
```

Add call schedule as hover component on every page