import { useEffect } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Share2, Wifi } from "lucide-react";

import { useSession, useSessionItems } from "@/hooks/use-sessions";
import { useSocket } from "@/hooks/use-socket";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ShareZone } from "@/components/ShareZone";
import { ItemsList } from "@/components/ItemsList";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DevBranding } from "@/components/DevBranding";

export default function Session() {
  const [, params] = useRoute("/session/:code");
  const [, setLocation] = useLocation();
  const code = params?.code || "";
  const { toast } = useToast();

  const { data: session, isLoading, error } = useSession(code);
  const { data: items = [] } = useSessionItems(code);

  // Initialize real-time synchronization via WebSockets.
  // This hook listens for 'NEW_ITEM' events from the server and
  // automatically invalidates React Query caches to refetch fresh data.
  useSocket(code);

  // Redirect if invalid session
  useEffect(() => {
    if (error || (!isLoading && !session)) {
      toast({
        title: "Session Expired",
        description: "This session is no longer active.",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [error, isLoading, session, setLocation, toast]);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: "Session code copied to clipboard" });
  };

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({ title: "Copied!", description: "Session link copied to clipboard" });
  };

  if (isLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md p-8">
          <Skeleton className="h-12 w-3/4 mx-auto rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:bg-muted p-2 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <img src="/icon-192.png" className="w-6 h-6 invert dark:invert-0" alt="Pair Drop" />
              <h1 className="text-xl font-bold tracking-tight hidden xs:block">Pair Drop</h1>
            </div>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full">
              <span className="text-sm font-mono font-bold tracking-wider">{code}</span>
              <button onClick={copyCode} className="hover:text-primary transition-colors p-1 rounded-md">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground bg-foreground/5 px-3 py-1.5 rounded-full border border-border">
              <Wifi className="w-3 h-3" />
              <span className="hidden xs:inline">Connected</span>
            </div>
            <Button variant="ghost" size="icon" onClick={copyLink} title="Share Link" className="rounded-full">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 min-h-0">

        {/* Left Col: Info & Share Zone */}
        <div className="lg:col-span-4 space-y-6 flex flex-col shrink-0">

          {/* QR Code Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden lg:block"
          >
            <Card className="p-6 bg-foreground text-background border-none shadow-2xl flex flex-col items-center text-center">
              <div className="bg-white p-3 rounded-xl mb-4 shadow-inner">
                <QRCodeSVG value={window.location.href} size={160} />
              </div>
              <h3 className="font-bold text-lg">Scan to Connect</h3>
              <p className="text-background/70 text-sm mt-2 max-w-[200px]">
                Point your camera at the QR code to join this session immediately.
              </p>
            </Card>
          </motion.div>

          {/* Share Input Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1"
          >
            <ShareZone code={code} />
          </motion.div>
        </div>

        {/* Right Col: Items Feed */}
        <div className="lg:col-span-8 flex flex-col min-h-0 flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Shared Items
              <span className="text-xs font-normal px-2 py-0.5 bg-muted rounded-full text-muted-foreground">{items.length}</span>
            </h2>
          </div>

          <div className="flex-1 bg-muted/20 border border-border/40 rounded-3xl p-4 overflow-hidden shadow-inner">
            <ItemsList items={items} />
          </div>
        </div>

      </main>

      {/* Footer branding */}
      <footer className="border-t border-border/5">
        <DevBranding />
      </footer>
    </div>
  );
}
