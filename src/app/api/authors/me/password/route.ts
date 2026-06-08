import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createClient } from '@/lib/supabase/server';
import { getAdminSession } from '@/lib/auth';

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword, confirmPassword } = await request.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: 'All password fields are required' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'New passwords do not match' }, { status: 400 });
    }

    if (String(newPassword).length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
    }

    if (currentPassword === newPassword) {
      return NextResponse.json({ error: 'New password must be different from the current password' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: author, error } = await supabase
      .from('authors')
      .select('id, password_hash')
      .eq('id', session.author_id)
      .single();

    if (error || !author) {
      return NextResponse.json({ error: 'Author profile not found' }, { status: 404 });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, author.password_hash);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    const { error: updateError } = await supabase
      .from('authors')
      .update({
        password_hash: passwordHash,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.author_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}
