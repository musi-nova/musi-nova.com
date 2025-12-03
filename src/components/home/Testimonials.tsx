import { AdvancedVideo } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';


const cld = new Cloudinary({ cloud: { cloudName: 'dudtoiunq' } });
const videos = [
  {
    publicId: 'qo_testimonial_rqzvqh',
    name: 'Global Q The Artist',
    desc: 'Artist Testimonial from Global Q The Artist',
    url: 'https://open.spotify.com/artist/0lAgiqUZ85Jy3bxOkiXoHH',
  },
  {
    publicId: 'jay_testimonial_oq8ee2',
    name: 'Jay',
    desc: 'Label Testimonial from Jay',
    url: 'https://starburstrecords.com',
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-musinova-lightyellow to-musinova-lightgreen">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-musinova-darkgray mb-4">
          What People Say About Us
        </h2>
        <p className="text-center text-musinova-darkgray mb-12 max-w-2xl mx-auto">
          Don't just take our word for it. Hear directly from artists and labels who have used Musi-Nova to grow their audience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {videos.map((video, idx) => (
            <div key={video.publicId} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
              <div className="relative w-full max-w-[350px] mx-auto rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '9/16' }}>
                <AdvancedVideo
                  cldVid={cld.video(video.publicId)}
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  style={{ background: '#000', objectFit: 'cover' }}
                  controls
                  poster={`https://res.cloudinary.com/dudtoiunq/video/upload/so_1/${video.publicId}.jpg`}
                />
              </div>
              <h3 className="font-bold text-lg text-musinova-darkgray mb-1">{video.name}</h3>
              <p className="text-gray-500 text-center text-sm">{video.desc}</p>
              {video.url && (
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-musinova-green hover:text-musinova-green/80 font-semibold underline text-sm transition-colors mb-1"
                >
                  Check them out
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;