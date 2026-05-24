import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const isSuperAdmin = decodedClaims.role === 'super_admin' || 
                         (adminEmail && decodedClaims.email === adminEmail);

    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Forbidden. Only Super Admins can manage user roles.' }, { status: 403 });
    }

    const body = await request.json();
    const { uid, role } = body;

    if (!uid || !role) {
      return NextResponse.json({ error: 'Missing uid or role' }, { status: 400 });
    }

    if (!['basic', 'admin', 'super_admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Set custom user claims in Firebase Auth
    await adminAuth.setCustomUserClaims(uid, { role });

    return NextResponse.json({ status: 'success', message: `User role successfully updated to ${role}` });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
