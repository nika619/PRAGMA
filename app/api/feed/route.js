import { generateRandomThreat } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

export async function GET() {
  const encoder = new TextEncoder();
  let isClosed = false;
  let timeoutId = null;

  const customReadable = new ReadableStream({
    start(controller) {
      const sendEvent = (data) => {
        if (isClosed) return;
        try {
          const message = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(message));
        } catch (e) {
          // Controller closed, clean up
          isClosed = true;
          if (timeoutId) clearTimeout(timeoutId);
        }
      };

      // Send initial connection success event
      sendEvent({ type: 'connected', message: 'SSE Connection Established' });

      // Generate a new threat every 3 to 8 seconds to simulate live feed
      const generateNext = () => {
        if (isClosed) return;
        sendEvent({ type: 'threat', data: generateRandomThreat() });
        const nextDelay = Math.floor(Math.random() * 5000) + 3000;
        timeoutId = setTimeout(generateNext, nextDelay);
      };

      generateNext();
    },
    cancel() {
      isClosed = true;
      if (timeoutId) clearTimeout(timeoutId);
    }
  });

  return new Response(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
