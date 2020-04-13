const getLatLng = (address) => {
  const front_url =
    "https://maps.googleapis.com/maps/api/geocode/json?address=";
  const end_url = "&key=AIzaSyBbpHHOjcFkGJeUaEIQZ-zNVaYBw0UVfzw";

  return window
    .fetch(front_url + address + end_url, {
      method: "GET",
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then((data) => {
      if (!data || data.error) {
        throw Error("API Error");
      } else {
        return data;
      }
    });
};

const sendEmail = (email, meeting) => {
  const json = { email: email, meeting: meeting };
  return window
    .fetch("/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    })
    .then((a) => {
      console.log(a);
    })
    .catch((a) => {
      console.log(a);
    });
};

const createSeller = (options) => {
  return window
    .fetch(`/make-seller`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then((data) => {
      if (!data || data.error) {
        throw Error("API Error");
      } else {
        return data;
      }
    });
};

const createCustomer = (options) => {
  return window
    .fetch(`/customer`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then((data) => {
      if (!data || data.error) {
        throw Error("API Error");
      } else {
        return data;
      }
    });
};

const createTransfers = (seller, cost, worker) => {
  const json = { seller: seller, cost: cost, worker: worker };
  return window
    .fetch(`/create-transfers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    });
};

const createPaymentIntent = (total, stripe_unique_id) => {
  console.log("PAYMENT");
  const json = { total: total, stripe_unique_id: stripe_unique_id };
  return window
    .fetch(`/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(total),
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then((data) => {
      if (!data || data.error) {
        throw new Error("PaymentIntent API Error");
      } else {
        return data.client_secret;
      }
    });
};

const getProductDetails = (cart) => {
  const subTotal = getSubtotal(cart);
  const tax = getTax(subTotal);
  const shipping = getShipping(subTotal);
  const total = parseInt((parseInt(subTotal) + tax + shipping) * 100) / 100;
  return {
    subTotal: subTotal,
    description: cart.description,
    pictures: cart.pictures,
    tax: tax,
    shipping: shipping,
    total: total,
    currency: "usd",
    amount: total,
    description: "dqdqwdqwdq",
  };
  console.log(total);
  return window
    .fetch(`/product-details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then((data) => {
      if (!data || data.error) {
        throw Error("API Error");
      } else {
        return data;
      }
    });
};

const getPublicStripeKey = (options) => {
  return window
    .fetch(`/public-key`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then((data) => {
      if (!data || data.error) {
        console.log("API error:", { data });
        throw Error("API Error");
      } else {
        return data.publicKey;
      }
    });
};

const getSubtotal = (cart) => {
  var totalPrice = 0;
  for (var i = 0; i < cart.length; i++) {
    const price = cart[i].original_price;
    totalPrice += price;
  }
  return ((totalPrice / 100) * 100).toFixed(2);
};

const getTax = (price) => {
  return parseInt(price * 0.08 * 100) / 100;
};

const getShipping = (price) => {
  return 3.12;
};

const api = {
  createTransfers: createTransfers,
  sendEmail: sendEmail,
  getLatLng: getLatLng,
  createSeller: createSeller,
  createPaymentIntent,
  createCustomer: createCustomer,
  getPublicStripeKey: getPublicStripeKey,
  getProductDetails: getProductDetails,
};

export default api;