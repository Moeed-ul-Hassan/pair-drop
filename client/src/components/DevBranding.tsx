import { Github, Linkedin, Twitter, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DevBranding() {
  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/moeedulhassanpk",
      icon: <Linkedin className="w-4 h-4" />,
    },
    {
      name: "X (Twitter)",
      url: "https://x.com/moeedulhassanpk",
      icon: <Twitter className="w-4 h-4" />,
    },
    {
      name: "GitHub",
      url: "https://github.com/Moeed-ul-Hassan",
      icon: <Github className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex items-center justify-center py-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-muted/50 transition-all duration-300"
          >
            <Avatar className="w-8 h-8 border border-border/50">
              <AvatarImage src="https://github.com/Moeed-ul-Hassan.png" alt="Moeed ul Hassan" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">MH</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-muted-foreground/80 lowercase tracking-tight">
              moeedulhassanpk
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-48 p-1 rounded-xl shadow-2xl border-border/40 backdrop-blur-xl bg-background/80">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 border-b border-border/10 mb-1">
            Connect
          </div>
          {socialLinks.map((link) => (
            <DropdownMenuItem
              key={link.name}
              className="rounded-lg cursor-pointer flex items-center justify-between p-2 hover:bg-primary/5 transition-colors group"
              onClick={() => window.open(link.url, "_blank")}
            >
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground group-hover:text-primary transition-colors">
                  {link.icon}
                </span>
                <span className="text-sm font-medium">{link.name}</span>
              </div>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
            </DropdownMenuItem>
          ))}
          <div className="mt-2 px-3 py-2 text-[9px] text-center text-muted-foreground/30 font-medium">
            Totally Free & Open Source
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
