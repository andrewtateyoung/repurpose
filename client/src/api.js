const getLatLng = (address, zip, city, state) => {
  if (zip && city && state) {
    return window
      .fetch(
        front_url + address + ", " + city + ", " + state + ", " + end_url,
        {
          method: "GET",
        }
      )
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
  } else {
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
  }
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
      console.log("RESULT GOOD");
      if (res.status === 200) {
        return res.json();
      } else {
        console.log("RESULT BAD");
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

const payWithPaypal = (x) => {
  console.log(x);
  return "x";
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

const scrapeForPrices = (total) => {
  console.log("API");
  const json = { total: total };
  console.log("starting");
  return window
    .fetch(`/fetch-item-price`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    })
    .then((res) => {
      console.log("then");
      if (res.status === 200) {
        console.log(res);
        return res.json();
      } else {
        return null;
      }
    })
    .then((data) => {
      console.log(data);
      if (!data || data.error) {
        throw new Error("Error");
      } else {
        return data;
      }
    });
};

const postToFb = (item) => {
  const json = { item: item };
  console.log("API");
  return window
    .fetch(`/post-to-fb`, {
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
    })
    .then((data) => {
      if (!data || data.error) {
        throw new Error("Error");
      } else {
        return data;
      }
    });
};

const api = {
  postToFb: postToFb,
  scrapeForPrices: scrapeForPrices,
  payWithPaypal: payWithPaypal,
  createTransfers: createTransfers,
  sendEmail: sendEmail,
  getLatLng: getLatLng,
  createPaymentIntent,
};

export default api;
