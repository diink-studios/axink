import { serve } from 'https://deno.land/std@0.178.0/http/server.ts';
import { contentType } from 'https://deno.land/std@0.178.0/media_types/mod.ts';
import { getFile, randomId } from './utils.ts';

// const __dirname = dirname(fromFileUrl(import.meta.url));

const handler = async (req: Request) => {
  const path = (new URL(req.url)).pathname;
  const stream = await getFile(path);

  if (!stream) return new Response(null, { status: 404 });

  // Get the extension se we can set the content-type header
  const ext = path.match(/\.[^\.]+$/);

  return new Response(stream, {
    status: 200,
    // @ts-ignore this will work just fine :D
    headers: {
      'x-respose-identifier': await randomId(),
      'Content-Type': ext ? contentType(ext[0]) : contentType('.html'),
    },
  });
};

await serve(handler, { port: 5050 });
