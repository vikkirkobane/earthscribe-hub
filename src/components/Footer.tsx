import { Sprout } from "lucide-react";

const Footer = () => {
  return (
    <footer className="gradient-hero text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-4">
            <Sprout className="w-8 h-8" />
            <span className="text-2xl font-bold">TerraGuardian</span>
          </div>

          {/* Tagline */}
          <p className="text-white/80 mb-6 max-w-md">
            Where Community Observations Meet AI Intelligence for Climate Action
          </p>

          {/* Links */}
          <div className="flex flex-wrap gap-6 text-sm text-white/70 mb-6">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">Community</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-white/60">
            © 2025 TerraGuardian. Empowering communities to restore our planet.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
