import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/actions/settings';

export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const settingsRes = await getSettings();
    const config = settingsRes.success ? (settingsRes.data?.config as any) : null;
    if (config?.faviconUrl) {
      const response = await fetch(config.faviconUrl);
      const buffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/png';
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }
  } catch (e) {
    console.error(e);
  }
  
  // Fallback
  const url = new URL(request.url);
  return NextResponse.redirect(new URL('/favicon-default.ico', url.origin));
}
