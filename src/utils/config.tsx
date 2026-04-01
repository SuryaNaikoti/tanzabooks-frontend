const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.tanzabooks.com';
export const NETWORK_URL = `${API_BASE_URL}/api`;
export const NETWORK_URL_DUMMY = 'https://fakestoreapi.com/';

export const OTP_RESEND_TIME = 30000;
