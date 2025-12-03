import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <footer className="bg-musinova-green text-white pt-12 pb-6">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="MusiNova Logo" className="h-10 w-auto" />
              <span className="font-bold text-xl text-white">Musi-Nova</span>
            </Link>
            <p className="mt-4 text-white-300">
              Giving artists control over their promotion process.
            </p>
          </div>
          
          {/* <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/playlist-checker" className="text-gray-300 hover:text-white">Playlist Checker</Link></li>
              <li><Link to="/smart-url" className="text-gray-300 hover:text-white">Smart URL</Link></li>
              <li><Link to="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link></li>
            </ul>
          </div> */}
    
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact & Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-300 hover:text-white">Contact Form</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6">
          <p className="text-sm text-center text-white-400">© {new Date().getFullYear()} MusiNova. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;