const API_BASE_URL = "https://api.tanzabooks.com";

export const createOrder = async (data) => {
  try {
    const response = await fetch(`${NETWORK_URL}/payment/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error("Create Order Error:", error);
    throw error;
  }
};

export const verifyPayment = async (data) => {
  try {
    const response = await fetch(`${NETWORK_URL}/payment/verify-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error("Verify Payment Error:", error);
    throw error;
  }
};
