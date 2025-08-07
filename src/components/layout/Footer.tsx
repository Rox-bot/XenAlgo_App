import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8" />
              <span className="text-xl font-bold">XenAlgo</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Empowering your trades with premium indicators, calculators, screeners, and educational courses for successful trading.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 cursor-pointer hover:text-accent transition-colors" />
              <Twitter className="h-5 w-5 cursor-pointer hover:text-accent transition-colors" />
              <Instagram className="h-5 w-5 cursor-pointer hover:text-accent transition-colors" />
              <Linkedin className="h-5 w-5 cursor-pointer hover:text-accent transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Home</Link></li>
              <li><Link to="/market-insights" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Market Insights</Link></li>
              <li><Link to="/courses" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Courses</Link></li>
              <li><Link to="/dashboard" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Financial Tools */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Financial Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/indicators" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Premium Indicators</Link></li>
              <li><Link to="/calculators" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Calculators</Link></li>
              <li><Link to="/screeners" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Screeners</Link></li>
              <li><Link to="/backtest-scanners" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Backtest Scanners</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-primary-foreground/80">support@xenalgo.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-primary-foreground/80">+91-9142505815</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-xs text-primary-foreground/60">
                7-Day Money Back Guarantee
              </p>
              <p className="text-xs text-primary-foreground/60">
                Secure Checkout • SSL Protected
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © 2024 XenAlgo. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;