const createSeller = options => {
  return window
    .fetch(`/make-seller`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(options)
    })
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then(data => {
      if (!data || data.error) {
        throw Error("API Error");
      } else {
        return data;
      }
    });
};

const createCustomer = options => {
  return window
    .fetch(`/customer`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then(data => {
      if (!data || data.error) {
        throw Error("API Error");
      } else {
        return data;
      }
    });
};

const createPaymentIntent = options => {
  return window
    .fetch(`/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(options)
    })
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then(data => {
      if (!data || data.error) {
        throw new Error("PaymentIntent API Error");
      } else {
        return data.client_secret;
      }
    });
};

const getProductDetails = options => {
  return window
    .fetch(`/product-details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then(data => {
      if (!data || data.error) {
        throw Error("API Error");
      } else {
        return data;
      }
    });
};

const getPublicStripeKey = options => {
  return window
    .fetch(`/public-key`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then(data => {
      if (!data || data.error) {
        console.log("API error:", { data });
        throw Error("API Error");
      } else {
        return data.publicKey;
      }
    });
};

const api = {
  createSeller: createSeller,
  createPaymentIntent,
  createCustomer: createCustomer,
  getPublicStripeKey: getPublicStripeKey,
  getProductDetails: getProductDetails
};

export default api;
