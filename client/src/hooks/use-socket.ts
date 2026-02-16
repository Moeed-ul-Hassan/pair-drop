import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api, WS_EVENTS } from '@shared/routes';
import { useToast } from '@/hooks/use-toast';

export function useSocket(code: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!code) return;

    // Determine WS protocol based on current window protocol
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws?code=${code}`;

    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('Connected to session:', code);
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === WS_EVENTS.NEW_ITEM) {
          // Invalidate items query to refetch new content
          queryClient.invalidateQueries({ 
            queryKey: [api.sessions.getItems.path, code] 
          });
          
          toast({
            title: "New Item",
            description: "A new item was shared to this session.",
          });
        }

        if (message.type === WS_EVENTS.JOIN) {
          toast({
            title: "Device Connected",
            description: "Another device has joined this session.",
          });
        }
      } catch (err) {
        console.error('Failed to parse WS message', err);
      }
    };

    socket.onclose = () => {
      console.log('Disconnected from session');
    };

    return () => {
      socket.close();
    };
  }, [code, queryClient, toast]);

  return socketRef.current;
}
