import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Upload, FileText, X, Loader2, Copy } from "lucide-react";
import { useAddItem } from "@/hooks/use-sessions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { formatBytes } from "@/lib/utils";

interface ShareZoneProps {
  code: string;
}

export function ShareZone({ code }: ShareZoneProps) {
  const [activeTab, setActiveTab] = useState("text");
  const [text, setText] = useState("");
  const addItem = useAddItem(code);

  const handleSendText = () => {
    if (!text.trim()) return;
    addItem.mutate(
      { type: "text", content: text },
      { onSuccess: () => setText("") }
    );
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Note: In a real production app, we would upload the file to a storage bucket first
    // and then send the URL. For this demo, we'll simulate it by creating a fake URL 
    // or base64 encoding small files if needed. 
    // Here we'll just implement the UI flow and send metadata.
    
    acceptedFiles.forEach(file => {
      // Mock upload for now - in real app, use FormData and upload endpoint
      addItem.mutate({
        type: "file",
        fileName: file.name,
        fileSize: file.size,
        content: "File uploaded via Dropzone", // In real app, this would be null
        fileUrl: URL.createObjectURL(file) // In real app, this comes from server
      });
    });
  }, [addItem]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Card className="p-4 sm:p-6 h-full shadow-2xl border-border/10 bg-card/50 backdrop-blur-xl rounded-3xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="w-full grid grid-cols-2 mb-4 bg-muted/50 p-1 rounded-2xl">
          <TabsTrigger value="text" className="text-sm font-bold rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <FileText className="w-4 h-4 mr-2" /> Text
          </TabsTrigger>
          <TabsTrigger value="file" className="text-sm font-bold rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Upload className="w-4 h-4 mr-2" /> Files
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 relative min-h-[250px]">
          <AnimatePresence mode="wait">
            {activeTab === "text" ? (
              <motion.div
                key="text"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="h-full flex flex-col"
              >
                <Textarea
                  placeholder="Paste text here to share instantly..."
                  className="flex-1 resize-none border-border/20 bg-muted/10 focus-visible:ring-1 focus-visible:ring-foreground/10 focus-visible:border-foreground/20 text-base p-5 rounded-2xl shadow-inner transition-all"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <Button 
                  className="mt-4 w-full h-14 text-base font-bold rounded-2xl bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-[0.98] shadow-lg shadow-foreground/5" 
                  onClick={handleSendText}
                  disabled={!text.trim() || addItem.isPending}
                >
                  {addItem.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
                  {addItem.isPending ? "Sharing..." : "Share Text"}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="file"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="h-full flex flex-col"
              >
                <div
                  {...getRootProps()}
                  className={`
                    flex-1 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-300
                    ${isDragActive ? "border-foreground bg-foreground/5 scale-[0.98]" : "border-border/40 hover:border-foreground/30 hover:bg-muted/30"}
                  `}
                >
                  <input {...getInputProps()} />
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all ${isDragActive ? "bg-foreground text-background rotate-12 scale-110" : "bg-muted text-foreground shadow-sm"}`}>
                    <Upload className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {isDragActive ? "Drop files here" : "Share Files"}
                  </h3>
                  <p className="text-sm text-muted-foreground/60 max-w-xs mx-auto leading-relaxed">
                    Drag and drop files here or click to browse. Files are shared instantly with paired devices.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Tabs>
    </Card>
  );
}
