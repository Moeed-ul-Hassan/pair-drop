import { motion } from "framer-motion";
import { CreateSessionCard } from "@/components/CreateSessionCard";
import { JoinSessionCard } from "@/components/JoinSessionCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-[0.03] pointer-events-none" />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 z-10">
        <div className="max-w-4xl w-full space-y-12">
          
          <div className="text-center space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-bold tracking-tighter"
            >
              Pair Drop
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto"
            >
              Securely share text and files between devices in real-time. 
              No login required. Just pair and drop.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 items-stretch">
            <div className="h-full">
              <CreateSessionCard />
            </div>
            <div className="h-full">
              <JoinSessionCard />
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center space-y-2 z-10 border-t border-border/10">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Pair Drop. Simple. Secure. Fast.</p>
        <p className="text-xs text-muted-foreground/60">
          Made with ❤️ by <a href="https://moedulhassan.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors font-medium underline underline-offset-4">Moeed ul Hassan</a>
        </p>
      </footer>
    </div>
  );
}
