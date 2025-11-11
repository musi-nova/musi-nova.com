# musi-nova.com
The musi-nova.com frontend.

## Getting Started
- `npm install` to install dependencies
- `npm run dev` to start the development server
- `npm run build` to build the project for production

- `npm install -g firebase-tools` to install Firebase CLI globally (if not already installed)
- `firebase login` to log in to Firebase
- `firebase deploy` to deploy the project to Firebase Hosting

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