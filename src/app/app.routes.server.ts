import { RenderMode, ServerRoute } from '@angular/ssr';

/** Client rendering avoids build-time prerender calling a live MongoDB API. */
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
