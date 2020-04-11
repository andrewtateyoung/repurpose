import React from "react";
import HeaderBar from "./HeaderBar";
import "./css/Sell.css";
import * as firebase from "firebase";
import { Input } from "@material-ui/core";
import Close from "./images/close.png";

export default class Sell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: false,
    };
  }
  render() {
    const singedin = !!firebase.auth().currentUser;
    const signedModal = !singedin && !this.state.newUser && !this.state.retUser;
    return (
      <div>
        {this.state.profile && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",

              // alignItems: "center"
            }}
          >
            <div
              onClick={(e) => this.closeModal(e)}
              style={{
                backgroundColor: "#000000",
                opacity: 0.5,
                zIndex: 99,
                width: "100vw",
                height: "100vh",
                position: "fixed",
              }}
            ></div>
            <div
              style={{
                width: "30vw",
                borderRadius: 5,
                height: "40vh",
                top: 30,
                backgroundColor: "#f5f5f5",
                position: "fixed",
                zIndex: 100,
                opacity: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  <img
                    id="close"
                    onClick={() => this.closeModal()}
                    src={Close}
                    style={{
                      width: 20,
                      height: 20,
                      marginTop: 20,
                      marginRight: 20,
                    }}
                  />
                </div>
                {signedModal && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontSize: 20, fontWeight: 600 }}>
                      Sign up / sign in
                    </div>
                    <Input
                      id="email"
                      placeholder="Enter your email"
                      style={{ width: 300, marginTop: 20 }}
                    />
                    <div
                      onClick={() => this.startShopping()}
                      id="start-shopping"
                      style={{
                        backgroundColor: "#a1a1a1",
                        borderRadius: 5,
                        padding: 10,
                        height: 30,
                        width: 300,
                        color: "white",
                        fontWeight: 600,
                        marginTop: 10,
                        marginBottom: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      START SHOPPING
                    </div>
                  </div>
                )}
                {!singedin && this.state.newUser && (
                  <div>
                    <div
                      style={{ fontSize: 20, fontWeight: 600, marginTop: 20 }}
                    >
                      What will your password be?
                    </div>
                    <Input
                      id="pass"
                      type="password"
                      placeholder="Password"
                      style={{ width: 300, marginTop: 30 }}
                    />
                    <div
                      onClick={() => this.setPassword()}
                      id="start-shopping"
                      style={{
                        backgroundColor: "#a1a1a1",
                        borderRadius: 5,
                        padding: 10,
                        height: 30,
                        width: 300,
                        color: "white",
                        fontWeight: 600,
                        marginTop: 10,
                        marginBottom: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      START SHOPPING
                    </div>
                  </div>
                )}
                {!singedin && this.state.retUser && (
                  <div>
                    {" "}
                    <div>
                      <div
                        style={{ fontSize: 20, fontWeight: 600, marginTop: 20 }}
                      >
                        Welcome back! What is your password?
                      </div>
                      <Input
                        id="pass"
                        type="password"
                        placeholder="Password"
                        style={{ width: 300, marginTop: 30 }}
                      />
                      <div
                        onClick={() => this.login()}
                        id="start-shopping"
                        style={{
                          backgroundColor: "#a1a1a1",
                          borderRadius: 5,
                          padding: 10,
                          height: 30,
                          width: 300,
                          color: "white",
                          fontWeight: 600,
                          marginTop: 10,
                          marginBottom: 10,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        START SHOPPING
                      </div>
                    </div>
                  </div>
                )}
                {singedin && !this.state.logout && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 600,
                        marginBottom: 20,
                      }}
                    >
                      Profile
                    </div>
                    <div
                      onClick={() => (window.location.href = "/orders")}
                      id="my-orders"
                      style={{
                        backgroundColor: "#a1a1a1",
                        borderRadius: 5,
                        padding: 10,
                        height: 30,
                        width: 100,
                        color: "white",
                        fontWeight: 600,
                        marginTop: 10,
                        marginBottom: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      MY ORDERS
                    </div>
                    <div
                      onClick={() => (window.location.href = "/mysales")}
                      id="my-sales"
                      style={{
                        backgroundColor: "#a1a1a1",
                        borderRadius: 5,
                        padding: 10,
                        height: 30,
                        width: 100,
                        color: "white",
                        fontWeight: 600,
                        marginTop: 10,
                        marginBottom: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      MY SALES
                    </div>
                    <div
                      onClick={() =>
                        this.setState({
                          logout: true,
                        })
                      }
                      id="logout"
                      style={{
                        backgroundColor: "#a1a1a1",
                        borderRadius: 5,
                        padding: 10,
                        height: 30,
                        width: 100,
                        color: "white",
                        fontWeight: 600,
                        marginTop: 10,
                        marginBottom: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      LOG OUT
                    </div>
                  </div>
                )}
                {this.state.logout && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ fontSize: 22, fontWeight: 600 }}>
                      Are you sure you want to logout?
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 20,
                      }}
                    >
                      <div
                        id="logout-yes"
                        onClick={() => this.logout()}
                        style={{
                          backgroundColor: "#a1a1a1",
                          borderRadius: 5,
                          padding: 10,
                          height: 30,
                          width: 100,
                          color: "white",
                          fontWeight: 600,
                          marginTop: 10,
                          marginBottom: 10,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 10,
                        }}
                      >
                        YES
                      </div>
                      <div
                        id="logout-no"
                        onClick={() => this.closeModal()}
                        style={{
                          marginLeft: 10,
                          backgroundColor: "#a1a1a1",
                          borderRadius: 5,
                          padding: 10,
                          height: 30,
                          width: 100,
                          color: "white",
                          fontWeight: 600,
                          marginTop: 10,
                          marginBottom: 10,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        CANCEL
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div>
          <HeaderBar />
        </div>
        <div style={{ margin: 10 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 100,
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: 0 }}>
              Selling items has never been easier.
            </div>
            <div
              style={{ display: "flex", flexDirection: "row", marginTop: 30 }}
            >
              <div
                style={{
                  height: 150,
                  width: 200,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  margin: 20,
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 500 }}>
                  1. Get a Collector
                </div>
                <div
                  style={{
                    textAlign: "center",
                    marginTop: 10,
                    color: "#a1a1a1",
                  }}
                >
                  At the (free) touch of a button, a Collector will come and
                  pick up all your items.
                </div>
              </div>
              <div
                style={{
                  height: 150,
                  width: 200,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  margin: 20,
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 500 }}>
                  2. Do Whatever
                </div>
                <div
                  style={{
                    textAlign: "center",
                    marginTop: 10,
                    color: "#a1a1a1",
                  }}
                >
                  The Collector will price your items and list them on our
                  website, so you don't do anything.
                </div>
              </div>
              <div
                style={{
                  height: 150,
                  width: 200,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  margin: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  3. Get Paid Instantly
                </div>
                <div
                  style={{
                    textAlign: "center",
                    marginTop: 10,
                    color: "#a1a1a1",
                  }}
                >
                  You get paid as soon as all your items are priced.
                </div>
              </div>
            </div>

            {singedin && (
              <div>
                <div
                  onClick={() => this.getStarted()}
                  id="header-checkout"
                  style={{
                    display: "flex",
                    width: 150,
                    textAlign: "center",
                    textDecoration: "none",
                    backgroundColor: "#a1a1a1",
                    borderRadius: 5,
                    padding: 10,
                    height: 20,
                    fontWeight: 600,
                    color: "white",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 150,
                  }}
                >
                  GET STARTED
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    marginTop: 20,
                    marginBottom: 20,
                    textAlign: "center",
                  }}
                >
                  OR
                </div>
                <div
                  onClick={() => (window.location.href = "/become_collector")}
                  id="header-checkout"
                  style={{
                    width: 150,
                    display: "flex",
                    textAlign: "center",
                    textDecoration: "none",
                    backgroundColor: "#a1a1a1",
                    borderRadius: 5,
                    padding: 10,
                    height: 20,
                    fontWeight: 600,
                    color: "white",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 150,
                  }}
                >
                  BECOME A COLLECTOR
                </div>
              </div>
            )}

            {!singedin && (
              <div>
                <div
                  onClick={() => this.showProfileModal()}
                  id="header-checkout"
                  style={{
                    display: "flex",
                    width: 150,
                    textAlign: "center",
                    textDecoration: "none",
                    backgroundColor: "#a1a1a1",
                    borderRadius: 5,
                    padding: 10,
                    height: 20,
                    fontWeight: 600,
                    color: "white",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 150,
                  }}
                >
                  GET STARTED
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    marginTop: 20,
                    textAlign: "center",
                    marginBottom: 20,
                  }}
                >
                  OR
                </div>
                <div
                  onClick={() => (window.location.href = "/become_collector")}
                  id="header-checkout"
                  style={{
                    width: 150,
                    display: "flex",
                    textAlign: "center",
                    textDecoration: "none",
                    backgroundColor: "#a1a1a1",
                    borderRadius: 5,
                    padding: 10,
                    height: 20,
                    fontWeight: 600,
                    color: "white",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 150,
                  }}
                >
                  BECOME A COLLECTOR
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  becomeCollector() {}

  startShopping() {
    const email = document.getElementById("email").value;
    if (!this.checkEmail(email)) {
      return;
    }
    firebase
      .firestore()
      .collection("Users")
      .doc(email)
      .get()
      .then((user) => {
        if (!user.exists) {
          // New account, render that screen.

          this.setState({
            newUser: true,
            email: email,
          });
        } else {
          // Returning user
          this.setState({
            retUser: true,
            email: email,
          });
        }
      });
  }

  showProfileModal() {
    this.setState({
      profile: true,
    });
  }

  getStarted() {
    if (!firebase.auth().currentUser) {
      this.showProfileModal();
    } else {
      // Take us to the stripe redirect
      const stripe_url =
        "https://connect.stripe.com/express/oauth/authorize?client_id=ca_GziEvM247byG5XcbBDVdmFHV5l3vPz4h&stripe_user%5Bproduct_description%5D=I am selling my own items.&stripe_user%5Bbusiness_type%5D=individual&redirect_uri=http://localhost:3000/sell/getkit";

      window.location.href = stripe_url;
    }
  }

  checkEmail(email) {
    if (!email) {
      alert("Bad email");
      return false;
    }
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    alert("Bad email");
    return false;
  }

  setPassword() {
    const email = this.state.email;
    const pass = document.getElementById("pass").value;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, pass)
      .then((r) => {
        this.state.logout = false;
        this.state.email = false;
        this.state.newUser = false;
        this.state.retUser = false;
        this.state.profile = false;
        firebase
          .firestore()
          .collection("Users")
          .doc(email)
          .set({
            cart: [],
            orders: [],
            sales: [],
            email: email,
            pass: pass,
          })
          .then(() => {
            this.state.logout = false;
            this.state.email = false;
            this.state.newUser = false;
            this.state.retUser = false;
            this.state.profile = false;
            window.location.href = "/sell/kit";
          });
      })
      .catch((e) => {
        alert(e.message);
      });
  }

  login() {
    const email = this.state.email;
    const pass = document.getElementById("pass").value;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then((r) => {
        this.state.logout = false;
        this.state.email = false;
        this.state.newUser = false;
        this.state.retUser = false;
        this.state.profile = false;
        window.location.href = "/sell/kit";
      })
      .catch((e) => {
        alert(e.message);
      });
  }

  search() {
    alert("search");
  }

  showProfileModal() {
    this.setState({
      profile: true,
      logout: false,
    });
  }

  closeModal(e) {
    this.setState({
      profile: false,
      logout: false,
      email: false,
      newUser: false,
      retUser: false,
    });
  }

  logout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.state.logout = false;
        this.state.email = false;
        this.state.newUser = false;
        this.state.retUser = false;
        this.state.profile = false;
        window.location.href = "/";
      });
  }
}
