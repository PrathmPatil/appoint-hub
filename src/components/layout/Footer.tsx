import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AH</span>
              </div>
              <h3 className="text-white text-lg font-bold">AppointHub</h3>
            </div>
            <p className="text-sm leading-relaxed">
              Your trusted platform for booking appointments with verified
              service providers. Making professional services accessible and
              convenient for everyone.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Quick Links</h4>
            <div className="space-y-2">
              <Link
                to="/services"
                className="block text-sm hover:text-white transition-colors"
              >
                Find Services
              </Link>
              <Link
                to="/explore"
                className="block text-sm hover:text-white transition-colors"
              >
                Explore
              </Link>
              <Link
                to="/help"
                className="block text-sm hover:text-white transition-colors"
              >
                Help Center
              </Link>
              <Link
                to="/dashboard"
                className="block text-sm hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* For Providers */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">For Providers</h4>
            <div className="space-y-2">
              <Link
                to="/register"
                className="block text-sm hover:text-white transition-colors"
              >
                Join as Provider
              </Link>
              <Link
                to="/dashboard/services"
                className="block text-sm hover:text-white transition-colors"
              >
                Manage Services
              </Link>
              <Link
                to="/dashboard/earnings"
                className="block text-sm hover:text-white transition-colors"
              >
                Earnings
              </Link>
              <Link
                to="/dashboard/verification"
                className="block text-sm hover:text-white transition-colors"
              >
                Verification
              </Link>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>support@appointhub.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>New York, NY 10001</span>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="pt-2">
              <h5 className="text-white font-medium mb-2">Stay Updated</h5>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="text-gray-400">
            © 2024 AppointHub. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-2 md:mt-0">
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
