import { Github, Twitter, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-12 px-6 bg-card border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-foreground mb-3">
              Transaction Categorization Engine
            </h3>
            <p className="text-muted-foreground mb-4">
              Enterprise-grade AI for autonomous financial transaction classification. 
              Built for developers who demand accuracy, control, and transparency.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/akthedeveloper17/" className="p-2 rounded-lg bg-secondary hover:bg-primary/10 transition-colors">
                <Github className="w-5 h-5 text-foreground" />
              </a>
              <a href="https://www.linkedin.com/in/ayushkumarengineer/" className="p-2 rounded-lg bg-secondary hover:bg-primary/10 transition-colors">
                <Linkedin className="w-5 h-5 text-foreground" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">Resources</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">GitHub Repository</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Model Cards</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2025 Transaction Categorization Engine. Open-source AI for financial intelligence.</p>
        </div>
      </div>
    </footer>
  );
};
