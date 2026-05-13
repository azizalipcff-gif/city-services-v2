import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Building2, Shield, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#071126] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
            >
              <h2 className="text-2xl font-bold text-[#d4af37] mb-4">CityServices</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Your trusted platform for finding local services in Moroccan cities.
                Starting with Oujda, connecting you with the best businesses near you.
                Quality services, verified businesses, and seamless connections.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4 mb-6">
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#d4af37] hover:text-[#071126] transition-all duration-300"
                >
                  <span className="text-sm font-bold">f</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#d4af37] hover:text-[#071126] transition-all duration-300"
                >
                  <span className="text-sm font-bold">t</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#d4af37] hover:text-[#071126] transition-all duration-300"
                >
                  <span className="text-sm font-bold">i</span>
                </a>
              </div>

              {/* Newsletter */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-3">Stay Updated</h4>
                <p className="text-gray-400 text-sm mb-4">Get notified about new businesses and features.</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent text-sm"
                  />
                  <button className="bg-[#d4af37] text-[#071126] px-4 py-2 rounded-lg hover:bg-[#b8941f] transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-300 hover:text-[#d4af37] transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </Link></li>
                <li><Link to="/search" className="text-gray-300 hover:text-[#d4af37] transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Search Businesses
                </Link></li>
                <li><Link to="/add-business" className="text-gray-300 hover:text-[#d4af37] transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Add Your Business
                </Link></li>
                <li><Link to="/admin-control" className="text-gray-300 hover:text-[#d4af37] transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Admin Panel
                </Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-[#d4af37] transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact
                </Link></li>
              </ul>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-6 text-white">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#d4af37] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">Oujda, Morocco</p>
                    <p className="text-gray-400 text-sm">Serving local businesses</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#d4af37] mt-1 flex-shrink-0" />
                  <div>
                    <a 
                      href="mailto:azizaliyt2ff@gmail.com" 
                      className="text-gray-300 hover:text-[#d4af37] transition-colors"
                    >
                      azizaliyt2ff@gmail.com
                    </a>
                    <p className="text-gray-400 text-sm">Support Email</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#d4af37] mt-1 flex-shrink-0" />
                  <div>
                    <a 
                      href="tel:0659785764" 
                      className="text-gray-300 hover:text-[#d4af37] transition-colors"
                    >
                      0659785764
                    </a>
                    <a 
                      href="https://wa.me/212659785764" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-[#d4af37] transition-colors flex items-center gap-1"
                    >
                      <span>WhatsApp</span>
                    </a>
                    <p className="text-gray-400 text-sm">Phone/WhatsApp</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <p className="text-gray-400 text-sm mb-3">Business Hours</p>
                  <p className="text-gray-300 text-sm">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-300 text-sm">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-gray-300 text-sm">Sunday: Closed</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Cities Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <h3 className="text-lg font-semibold mb-6 text-white text-center">Available Cities</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#" className="bg-[#d4af37] text-[#071126] px-4 py-2 rounded-lg font-semibold hover:bg-[#b8941f] transition-colors">
                Oujda
              </a>
              <a href="#" className="bg-white/10 text-gray-300 px-4 py-2 rounded-lg hover:bg-white/20 hover:text-white transition-colors">
                Casablanca (Coming Soon)
              </a>
              <a href="#" className="bg-white/10 text-gray-300 px-4 py-2 rounded-lg hover:bg-white/20 hover:text-white transition-colors">
                Rabat (Coming Soon)
              </a>
              <a href="#" className="bg-white/10 text-gray-300 px-4 py-2 rounded-lg hover:bg-white/20 hover:text-white transition-colors">
                Marrakech (Coming Soon)
              </a>
              <a href="#" className="bg-white/10 text-gray-300 px-4 py-2 rounded-lg hover:bg-white/20 hover:text-white transition-colors">
                Fes (Coming Soon)
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Contact Info */}
              <div className="flex flex-col sm:flex-row items-center gap-6 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#d4af37]" />
                  <span>info@cityservices.ma</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#d4af37]" />
                  <span>+212 600 000 000</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#d4af37]" />
                  <span>Oujda, Morocco</span>
                </div>
              </div>

              {/* Copyright */}
              <div className="text-gray-400 text-sm text-center md:text-right">
                <p>© 2024 CityServices. All rights reserved.</p>
                <p className="mt-1">Made with ❤️ for Moroccan communities.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;