import { NextResponse } from 'next/server';
import axios from 'axios';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, wix-site-id',
    },
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const submissionId = searchParams.get('submissionId');

  if (!process.env.WIX_API_KEY || !process.env.WIX_SITE_ID) {
    console.error('Missing WIX_API_KEY or WIX_SITE_ID');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  if (!submissionId) {
    return NextResponse.json({ error: 'submissionId is required' }, { status: 400 });
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(submissionId)) {
    return NextResponse.json({ error: 'Invalid submissionId format' }, { status: 400 });
  }

  try {
    const response = await axios.get(
      `https://www.wixapis.com/form-submission-service/v4/submissions/${submissionId}`,
      {
        headers: {
          Authorization: process.env.WIX_API_KEY,
          'wix-site-id': process.env.WIX_SITE_ID,
        },
      }
    );

    const nextResponse = NextResponse.json({
      status: response.data.submission.status,
    });
    nextResponse.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return nextResponse;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
      const details = error.response?.status === 404 ? 'Submission not found' : 'Internal server error';
      return NextResponse.json(
        { error: 'Failed to fetch submission', details },
        { status: error.response?.status || 500 }
      );
    }
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}