import { Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

const SocialIcons = () => {
  return (
    <div className="fixed hidden left-8 bottom-0 md:flex flex-col items-center gap-6 z-50">
      {/* GitHub */}
      <Link href="https://github.com/AbdushakurOB" target="_blank" className="social-icon">
        <Github className="h-6 w-6 text-muted-foreground hover:text-primary transition-all" />
      </Link>

      {/* Twitter */}
      <Link href="https://twitter.com/AbdushakurOB" target="_blank" className="social-icon">
        <Twitter className="h-6 w-6 text-muted-foreground hover:text-primary transition-all" />
      </Link>

      {/* Linkedin */}
      <Link href="https://linkedin.com/in/AbdushakurOB" target="_blank" className="social-icon">
        <Linkedin className="h-6 w-6 text-muted-foreground hover:text-primary transition-all" />
      </Link>

      <div className="w-px h-32 bg-border" />
    </div>
  );
};

export default SocialIcons;
