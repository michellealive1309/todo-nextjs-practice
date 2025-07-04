import { QUERY } from '@/constant/query';
import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string, 10) : 1;
  const size = searchParams.get('size') ? parseInt(searchParams.get('limit') as string, 10) : QUERY.Size;
  const todos = await db.todo.findMany({
    skip: (page - 1) * size,
    take: size,
    orderBy: { id: 'desc'}
  });
  return NextResponse.json(todos);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description, status } = body;

  const todo = await db.todo.create({
    data: {
      title,
      description,
      status,
    },
  }).catch(err => {
    console.error('Error creating todo:', err.message);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  });

  return NextResponse.json(todo, { status: 200, headers: { 'Content-Type': 'application/json' } });
}