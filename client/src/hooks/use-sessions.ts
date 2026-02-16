import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type AddItemInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// ============================================
// SESSION HOOKS
// ============================================

// POST /api/sessions - Create new session
export function useCreateSession() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.sessions.create.path, { 
        method: api.sessions.create.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error('Failed to create session');
      return api.sessions.create.responses[201].parse(await res.json());
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not create a new session. Please try again.",
        variant: "destructive",
      });
    }
  });
}

// GET /api/sessions/:code - Verify/Get session
export function useSession(code: string) {
  return useQuery({
    queryKey: [api.sessions.getByCode.path, code],
    queryFn: async () => {
      if (!code || code.length < 6) return null;
      const url = buildUrl(api.sessions.getByCode.path, { code });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch session');
      
      return api.sessions.getByCode.responses[200].parse(await res.json());
    },
    enabled: !!code && code.length >= 6,
    retry: false
  });
}

// ============================================
// ITEM HOOKS
// ============================================

// GET /api/sessions/:code/items - List items
export function useSessionItems(code: string) {
  return useQuery({
    queryKey: [api.sessions.getItems.path, code],
    queryFn: async () => {
      if (!code) return [];
      const url = buildUrl(api.sessions.getItems.path, { code });
      const res = await fetch(url, { credentials: "include" });
      
      if (!res.ok) throw new Error('Failed to fetch items');
      
      return api.sessions.getItems.responses[200].parse(await res.json());
    },
    enabled: !!code,
  });
}

// POST /api/sessions/:code/items - Add item (Text or File)
export function useAddItem(code: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (item: AddItemInput) => {
      // Validate input client-side using the schema
      const validated = api.sessions.addItem.input.parse(item);
      
      const url = buildUrl(api.sessions.addItem.path, { code });
      const res = await fetch(url, {
        method: api.sessions.addItem.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) throw new Error('Failed to share item');
      
      return api.sessions.addItem.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.sessions.getItems.path, code] });
      toast({
        title: "Sent",
        description: "Item shared successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send item",
        variant: "destructive",
      });
    }
  });
}
