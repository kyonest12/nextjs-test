import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST() {
  try {
    revalidateTag('todos');

    return NextResponse.json({ message: 'Cache for posts revalidated' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error revalidating posts', error}, { status: 500 });
  }
}
