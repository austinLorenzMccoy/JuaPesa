import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Twitter, Github, Linkedin, Mail, Phone, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";
import juapesaLogo from "/photo-uploads/773bff5d-7a85-4680-989f-75002bbc3dc9.png";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Products",
      links: [
        { name: "Smart Loans", href: "/loans" },
        { name: "AI Savings", href: "/savings" },
        { name: "Liquidity Pools", href: "/dashboard" },
        { name: "Cross-Border Transfers", href: "/dashboard" }
      ]
    },
    {
      title: "Company", 
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Blog", href: "/blog" },
        { name: "Press", href: "/press" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "API Documentation", href: "/docs" },
        { name: "Contact Support", href: "/support" },
        { name: "Status", href: "/status" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Compliance", href: "/compliance" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/juapesa", label: "Twitter" },
    { icon: Github, href: "https://github.com/juapesa", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/company/juapesa", label: "LinkedIn" },
    { icon: Mail, href: "mailto:hello@juapesa.com", label: "Email" }
  ];

  return (
    <footer className="relative border-t border-border/50 bg-background/95 backdrop-blur-sm">
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-orb absolute -top-20 -left-20 w-40 h-40 opacity-30" />
        <div className="floating-orb absolute -bottom-20 -right-20 w-60 h-60 opacity-20" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Main footer content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Brand section */}
            <div className="lg:col-span-2 space-y-6">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-primary/25">
                  <img 
                    src={juapesaLogo} 
                    alt="JuaPesa" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-2xl font-bold font-crypto bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  JuaPesa
                </span>
              </Link>
              
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                Revolutionizing African financial services with AI-powered liquidity routing, 
                instant cross-wallet transfers, and smart financial products.
              </p>

              {/* Newsletter signup */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Stay Updated</h4>
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Enter your email" 
                    className="glass-card border-border/50 bg-card/50"
                  />
                  <Button size="sm" className="gradient-primary click-scale">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>hello@juapesa.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+254 700 000 000</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Lagos, Nigeria</span>
                </div>
              </div>
            </div>

            {/* Links sections */}
            {footerSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-4"
              >
                <h4 className="font-semibold text-foreground font-crypto">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        to={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:translate-x-1 transform block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border/50 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              © {currentYear} JuaPesa. All rights reserved. | 
              <span className="text-primary"> Built with ❤️ in Africa</span>
            </div>

            {/* Social links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg glass-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300 click-scale"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="text-center">
                <div className="font-semibold text-primary font-crypto">50K+</div>
                <div className="text-muted-foreground">Users</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-secondary font-crypto">$2M+</div>
                <div className="text-muted-foreground">Transferred</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-accent font-crypto">99.9%</div>
                <div className="text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};