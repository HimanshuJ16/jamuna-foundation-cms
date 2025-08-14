import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

// Configuration constants
const API_BASE_URL = 'https://www.wixapis.com';
const FORM_SUBMISSION_ENDPOINT = '/form-submission-service/v4/submissions';
const PAYMENT_ORDERS_ENDPOINT = '/ecom/v1/payments/orders';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CACHE_DURATION = 3600; // 1 hour in seconds

// Interface for type safety
interface SubmissionResponse {
  submission: {
    status: string;
    orderDetails: {
      orderId: string;
    };
  };
}

interface PaymentResponse {
  orderTransactions: {
    orderId: string;
    payments: Array<{
      id: string;
      regularPaymentDetails: {
        providerTransactionId?: string;
        paymentMethod?: string;
        offlinePayment?: boolean;
        status?: string;
        paymentProvider?: string;
        gatewayTransactionId?: string;
        paymentOrderId?: string;
        savedPaymentMethod?: boolean;
        chargebacks?: Array<unknown>;
      };
      createdDate?: string;
      updatedDate?: string;
      amount?: {
        amount: string;
        formattedAmount: string;
      };
      refundDisabled?: boolean;
      supportReceiptGeneration?: boolean;
    }>;
    refunds: Array<unknown>;
  };
}

// Error response helper
const createErrorResponse = (message: string, status: number, details?: string) => {
  return NextResponse.json(
    { error: message, details },
    { status }
  );
};

// Configure axios instance
const wixApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: process.env.WIX_API_KEY || '',
    'wix-site-id': process.env.WIX_SITE_ID || '',
  },
  timeout: 10000, // 10 seconds timeout
});

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
  // Validate environment variables
  if (!process.env.WIX_API_KEY || !process.env.WIX_SITE_ID) {
    console.error('Missing WIX_API_KEY or WIX_SITE_ID');
    return createErrorResponse('Server configuration error', 500);
  }

  // Extract and validate submissionId
  const { searchParams } = new URL(request.url);
  const submissionId = searchParams.get('submissionId');

  if (!submissionId) {
    return createErrorResponse('submissionId is required', 400);
  }

  if (!UUID_REGEX.test(submissionId)) {
    return createErrorResponse('Invalid submissionId format', 400);
  }

  try {
    // Fetch submission data
    const submissionResponse = await wixApi.get<SubmissionResponse>(
      `${FORM_SUBMISSION_ENDPOINT}/${submissionId}`
    );

    // Validate submission response
    if (!submissionResponse.data.submission?.orderDetails?.orderId) {
      return createErrorResponse('Invalid submission data: missing orderId', 400);
    }

    // Fetch payment data
    const paymentResponse = await wixApi.get<PaymentResponse>(
      `${PAYMENT_ORDERS_ENDPOINT}/${submissionResponse.data.submission.orderDetails.orderId}`
    );

    // Validate payment response
    if (!paymentResponse.data.orderTransactions?.payments?.length) {
      return createErrorResponse('No payment transactions found for this order', 400);
    }

    if (!paymentResponse.data.orderTransactions.payments[0]?.regularPaymentDetails?.providerTransactionId) {
      return createErrorResponse('Payment transaction missing providerTransactionId', 400);
    }

    // Prepare response
    const response = NextResponse.json({
      status: submissionResponse.data.submission.status,
      orderId: submissionResponse.data.submission.orderDetails.orderId,
      paymentId: paymentResponse.data.orderTransactions.payments[0].regularPaymentDetails.providerTransactionId,
    });

    // Set cache headers
    response.headers.set('Cache-Control', `s-maxage=${CACHE_DURATION}, stale-while-revalidate`);

    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Axios error:', error.response?.data || error.message);
      const status = error.response?.status || 500;
      const details = status === 404 ? 'Submission or order not found' : 'Internal server error';
      return createErrorResponse('Failed to fetch submission', status, details);
    }

    console.error('Unexpected error:', error);
    return createErrorResponse('Unexpected error occurred', 500);
  }
}