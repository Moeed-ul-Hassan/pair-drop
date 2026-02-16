import { motion } from "framer-motion";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { useCreateSession } from "@/hooks/use-sessions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CreateSessionCard() {
  const [, setLocation] = useLocation();
  const createSession = useCreateSession();

  const handleCreate = () => {
    createSession.mutate(undefined, {
      onSuccess: (data) => {
        setLocation(`/session/${data.code}`);
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="h-full"
    >
      <Card className="h-full border-border bg-card/50 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:border-primary/20 transition-all duration-300 group relative overflow-hidden">
        {/* Decorative gradient blob */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
        
        <CardHeader>
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Start Sharing</CardTitle>
          <CardDescription className="text-base mt-2">
            Generate a unique secure code to start a new pairing session instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Button 
            size="lg" 
            className="w-full h-14 text-lg font-medium group-hover:translate-y-[-2px] transition-all shadow-lg shadow-primary/20"
            onClick={handleCreate}
            disabled={createSession.isPending}
          >
            {createSession.isPending ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Generate Code"
            )}
            {!createSession.isPending && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
