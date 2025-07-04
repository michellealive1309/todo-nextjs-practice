import prisma from '@/lib/db';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const todo = await prisma.todo.findUnique({
    where: { id: Number(id) },
  }).catch(err => {
    console.error('Error fetching todo:', err.message)
  });
  if (!todo) {
    return new Response(JSON.stringify({ error: 'Todo not found' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 404,
    });
  }
  return NextResponse.json(todo);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, title, description, status } = body;

  const todo = await prisma.todo.update({
    where: { id: Number(id) },
    data: {
      title,
      description,
      status,
    },
  });

  return NextResponse.json(todo);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const todo = await prisma.todo.delete({
    where: { id: Number(id) },
  });

  if (!todo) {
    return NextResponse.json({success: false})
  }

  return NextResponse.json({ success: true});
}