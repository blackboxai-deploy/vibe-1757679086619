import { NextRequest, NextResponse } from 'next/server';

// Simple endpoint that confirms Socket.IO readiness
export async function GET() {
  console.log('🚀 Socket.IO API endpoint called');
  
  return NextResponse.json({
    message: 'Socket.IO server is ready',
    timestamp: new Date().toISOString(),
    path: '/api/socket'
  }, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

// Handle other HTTP methods by redirecting to GET
export const POST = GET;
export const PUT = GET;
export const DELETE = GET;