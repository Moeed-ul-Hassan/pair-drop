import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Copy, File, Clock } from "lucide-react";
import { type SharedItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { formatBytes } from "@/lib/utils";

interface ItemsListProps {
  items: SharedItem[];
}

export function ItemsList({ items }: ItemsListProps) {
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const handleDownload = (url: string, filename: string) => {
    // In a real app this would trigger a proper download
    // For demo using blob URL
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast({
      title: "Downloading...",
      description: `Starting download for ${filename}`,
    });
  };

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 border-2 border-dashed border-border rounded-xl">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 opacity-50" />
        </div>
        <p className="text-lg font-medium">No items yet</p>
        <p className="text-sm">Shared items will appear here instantly</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-4 pb-4">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              layout
              className="bg-card border border-border/40 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-xl hover:border-border/80 transition-all group relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 overflow-hidden w-full">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm
                    ${item.type === 'text' ? 'bg-foreground text-background' : 'bg-muted text-foreground'}
                  `}>
                    {item.type === 'text' ? <FileText className="w-6 h-6" /> : <File className="w-6 h-6" />}
                  </div>
                  
                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                        {item.type === 'text' ? 'Text' : 'File'}
                      </span>
                      <span className="text-[10px] text-muted-foreground/30">•</span>
                      <span className="text-[10px] text-muted-foreground/40 font-mono">
                        {new Date(item.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    {item.type === 'text' ? (
                      <p className="text-foreground whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed font-medium">
                        {item.content}
                      </p>
                    ) : (
                      <div className="flex flex-col gap-0.5">
                        <p className="text-foreground font-bold truncate text-sm sm:text-base">{item.fileName}</p>
                        <p className="text-xs text-muted-foreground/60 font-mono">
                          {formatBytes(item.fileSize || 0)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 flex flex-col gap-2">
                  {item.type === 'text' ? (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleCopy(item.content || "")}
                      className="h-10 w-10 rounded-xl hover:bg-foreground hover:text-background transition-all active:scale-90"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleDownload(item.fileUrl || "", item.fileName || "download")}
                      className="h-10 w-10 rounded-xl hover:bg-foreground hover:text-background transition-all active:scale-90"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
}
