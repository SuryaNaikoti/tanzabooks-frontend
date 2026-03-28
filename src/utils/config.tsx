const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
export const NETWORK_URL = isLocal 
  ? 'http://localhost:8002/api' 
  : 'https://chairman-void-nylon-bone.trycloudflare.com/api';
export const NETWORK_URL_DUMMY = 'https://fakestoreapi.com/';

export const OTP_RESEND_TIME = 30000;
