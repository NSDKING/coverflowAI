// src/app/api/checkout/route.ts (or similar)
import { headers } from 'next/headers';

export async function POST(req: Request) {
  const headersList = await headers();
  // Get the host (e.g., localhost:3000 or mydomain.com)
  const host = headersList.get('host');
  // Determine protocol (http for local, https for production)
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  
  const baseURL = `${protocol}://${host}`;

  // Now use baseURL for your Stripe/Checkout session
  const successUrl = `${baseURL}/success`;
  // ... rest of your code
}