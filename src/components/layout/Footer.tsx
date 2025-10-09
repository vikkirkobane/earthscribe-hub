import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="bg-primary p-1.5 rounded-full">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">TerraGuardian</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Empowering communities to become active land stewards through accessible technology.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/quests" className="hover:text-foreground">Quests</Link></li>
              <li><Link to="/ai-advisor" className="hover:text-foreground">AI Advisor</Link></li>
              <li><Link to="/plots" className="hover:text-foreground">Plot Management</Link></li>
              <li><Link to="/impact" className="hover:text-foreground">Impact Tracking</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-foreground">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              <li><Link to="/security" className="hover:text-foreground">Security</Link></li>
              <li><Link to="/compliance" className="hover:text-foreground">Compliance</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TerraGuardian. All rights reserved. Where Community Observations Meet AI Intelligence for Climate Action.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;