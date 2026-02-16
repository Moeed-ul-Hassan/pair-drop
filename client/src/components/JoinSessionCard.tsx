import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Hash, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useSession } from "@/hooks/use-sessions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function JoinSessionCard() {
  const [, setLocation] = useLocation();
  const [code, setCode] = useState("");
  const { toast } = useToast();
  
  // We query to check if session exists before navigating
  const { refetch, isFetching } = useSession(code);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit code.",
        variant: "destructive"
      });
      return;
    }

    const result = await refetch();
    
    if (result.data) {
      setLocation(`/session/${result.data.code}`);
    } else {
      toast({
        title: "Session Not Found",
        description: "The code you entered does not exist or has expired.",
        variant: "destructive"
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="h-full"
    >
      <Card className="h-full border-border bg-card/50 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:border-primary/20 transition-all duration-300 group relative overflow-hidden">
        {/* Decorative gradient blob */}
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

        <CardHeader>
          <div className="w-12 h-12 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
            <Hash className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Join Session</CardTitle>
          <CardDescription className="text-base mt-2">
            Enter an existing code to connect and start receiving items.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleJoin} className="space-y-4">
            <div className="relative">
              <Input
                placeholder="123456"
                className="h-14 text-center text-xl tracking-[0.5em] font-mono uppercase bg-background border-2 focus-visible:ring-0 focus-visible:border-primary transition-all"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
            </div>
            <Button 
              type="submit" 
              size="lg" 
              variant="secondary"
              className="w-full h-14 text-lg font-medium group-hover:translate-y-[-2px] transition-all"
              disabled={isFetching || code.length < 6}
            >
              {isFetching ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                "Connect"
              )}
              {!isFetching && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
