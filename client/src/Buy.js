import React from "react";
import "./css/Buy.css";
import ClipLoader from "react-spinners/ClipLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import Close from "./images/close.png";
import HeaderBar from "./HeaderBar";
import * as firebase from "firebase";
import randomizeArray from "./global_methods/randomizeArray";
import FilterBar from "./FilterBar";
import Back from "./images/back.png";
import Front from "./images/arrow.png";
import { MixpanelProvider, MixpanelConsumer } from "react-mixpanel";
import { ThemeProvider } from "@livechat/ui-kit";
import Chat from "./Chat";

export default class Buy extends React.Component {
  innerWidth = window.innerWidth;
  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.state = {
      loaded: false,
      currentIndex: 0,
      currentCategoryIndex: 0,
      currentItemIndex: 0,
      items: [],
      finalDoc: 0,
      activeClothingType: "all",
      activeClothingGender: "all",
      newCategory: true,
      finishedLoading: false,
      appended: false,
      activeCategories: [true, true, true, true, true, true, true, true, true],
      finishedPullingItems: false,
      newItems: [],
      foundNewItems: true,
      width: 0,
      height: 0,
      activeSales: [true, true, true, true, true, true, true, true, true],
      modalPictureIndex: 0,
    };
    this.state.finishedPullingItems = false;
    this.pullItemsFromDatabase(this.state.activeCategories, null, true);
    this.pullNewItemsFromDatabase();
  }
  render() {
    if (!this.state.loaded || !this.state.foundNewItems) {
      return (
        <div
          style={{
            position: "fixed",
            left: "45vw",
            top: 200,
          }}
        >
          <ClipLoader
            size={150}
            color={"#123abc"}
            loading={this.state.loading}
          />
        </div>
      );
    }
    const q = window.location.search;
    const urlParams = new URLSearchParams(q);
    var itemCategory = urlParams.get("itemcategory");
    if (itemCategory && itemCategory.trim() == "Art") {
      itemCategory = "Art & Decoration";
    } else if (itemCategory && itemCategory.trim() == "Clothing, Shoes,") {
      itemCategory = "Clothing, Shoes, & Accessories";
    } else if (itemCategory && itemCategory.trim() == "Sports") {
      itemCategory = "Sports & Hobbies";
    } else if (itemCategory && itemCategory.trim() == "Toys") {
      itemCategory = "Toys & Games";
    }
    const city = urlParams.get("city");
    var item = urlParams.get("item");
    if (item && !this.state.modal) {
      // We need to pull the item from the database.
      firebase
        .firestore()
        .collection("Categories")
        .doc(itemCategory)
        .collection("All")
        .doc(item)
        .get()
        .then((itemData) => {
          if (!itemData || !itemData.data()) {
            item = null;
          } else {
            this.setState({
              modal: itemData.data(),
            });
          }
        });
      return (
        <div
          style={{
            position: "fixed",
            left: "45vw",
            top: 200,
          }}
        >
          <ClipLoader
            size={150}
            color={"#123abc"}
            loading={this.state.loading}
          />
        </div>
      );
    }
    if (city) {
      localStorage.setItem("city", city);
    }
    // Set the modal variables
    var itemDiscount = -1;
    var itemCurrentPrice = -1;
    var showDecimalsOriginal = true;
    var showDecimalsCurrent = true;

    if (item) {
      itemDiscount = 1 - this.state.modal.current_price;
      itemCurrentPrice =
        this.state.modal.original_price -
        this.state.modal.original_price * itemDiscount;
      // See if we need decimals for the original price
      if (this.state.modal.original_price % 1 == 0) {
        showDecimalsOriginal = false;
      }
      // See if ywe need decimals for the current price
      if (itemCurrentPrice % 1 == 0) {
        showDecimalsCurrent = false;
      }
    }

    var numItemsFound = 0;

    return (
      <div
        id="buy-desktop-main"
        style={{ overflowY: "scroll", overflowX: "hidden", height: "100vh" }}
      >
        <Chat />
        <div
          style={{
            position: "fixed",
            height: "90vh",
            top: "10vh",
            width: "15vw",
            backgroundColor: "#fafafa",
          }}
        >
          <FilterBar
            updateFilter={(a, b) => this.updateFilter(a, b)}
            updateCategoryFilter={(category) =>
              this.updateCategoryFilter(category)
            }
            updateSaleFilter={(a, b) => this.updateSaleFilter(a, b)}
          />
        </div>
        {!this.state.loaded && (
          <div
            style={{
              position: "fixed",
              left: "45vw",
              top: 200,
            }}
          >
            <ClipLoader
              size={150}
              color={"#123abc"}
              loading={this.state.loading}
            />
          </div>
        )}
        <div style={{ display: !this.state.loaded ? "none" : "block" }}>
          {item && (
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
                  width: "60vw",
                  minWidth: this.innerWidth * 0.6,
                  borderRadius: 5,
                  position: "fixed",
                  height: "80vh",
                  top: 30,
                  backgroundColor: "#f5f5f5",
                  // position: "absolute",
                  zIndex: 100,
                  opacity: 1,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
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
                        marginTop: 15,
                        marginRight: 15,
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div style={{ marginLeft: 20 }}>
                        <img
                          src={
                            this.state.modal.pictures[
                              this.state.modalPictureIndex
                            ]
                          }
                          style={{
                            borderRadius: 3,
                            maxWidth: 400,
                            maxHeight: 400,
                            minWidth: 300,
                            minHeight: 300,
                          }}
                        ></img>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: 20,
                          marginTop: 10,
                        }}
                      >
                        {" "}
                        {this.state.modal.pictures.map((pic, index) => {
                          return (
                            <div
                              id="picture-map"
                              key={index}
                              onClick={() => this.changeModalImg(index)}
                            >
                              <img
                                src={pic}
                                style={{
                                  width: 80,
                                  height: 80 * 0.9,
                                  marginLeft: 5,
                                  marginRight: 5,
                                }}
                              ></img>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 22,
                            fontWeight: 500,
                            marginTop: 30,
                            textAlign: "center",
                            padding: 10,
                          }}
                        >
                          {this.state.modal.title}
                        </div>

                        {Math.round(itemDiscount * 100).toFixed(0) != 0 && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                marginTop: 10,
                                fontWeight: 500,
                                fontSize: 22,
                                textAlign: "center",
                                textDecoration: "line-through",
                              }}
                            >
                              {!showDecimalsOriginal &&
                                "$" +
                                  (
                                    Math.round(
                                      this.state.modal.original_price * 100
                                    ) / 100
                                  ).toFixed(0)}
                              {showDecimalsOriginal &&
                                "$" +
                                  (
                                    Math.round(
                                      this.state.modal.original_price * 100
                                    ) / 100
                                  ).toFixed(2)}
                            </div>
                            <div
                              style={{
                                fontWeight: 400,
                                fontSize: 16,
                                marginLeft: 10,
                                color: "#cc0000",
                                textAlign: "center",
                                marginTop: 10,
                              }}
                            >
                              {Math.round(itemDiscount * 100).toFixed(0) +
                                "% off"}
                            </div>
                          </div>
                        )}
                        <div
                          style={{
                            marginTop: 30,
                            fontWeight: 700,
                            fontSize: 24,
                            textAlign: "center",
                          }}
                        >
                          {!showDecimalsCurrent &&
                            "$" +
                              (
                                Math.round(itemCurrentPrice * 100) / 100
                              ).toFixed(0)}
                          {showDecimalsCurrent &&
                            "$" +
                              (
                                Math.round(itemCurrentPrice * 100) / 100
                              ).toFixed(2)}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            // alignItems: "center",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <div
                            onClick={() => this.addToCart(this.state.modal)}
                            id="add-to-cart"
                            style={{
                              backgroundColor: "#426CB4",
                              marginTop: 30,
                              borderRadius: 5,
                              padding: 10,
                              maxWidth: 200,
                              minWidth: 150,
                              height: "5vh",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#ffffff",
                              fontWeight: 500,
                            }}
                          >
                            {/* {this.state.addingToCart && (
                              <MixpanelConsumer>
                                {(mixpanel) => this.setMixpanel(mixpanel)}
                              </MixpanelConsumer>
                            )} */}
                            {!this.state.addingToCart && "ADD TO CART"}
                            {this.state.addingToCart && "Adding..."}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      marginLeft: 20,
                      fontSize: 20,
                      marginTop: 20,
                      fontWeight: 600,
                    }}
                  >
                    Item Details
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      marginLeft: 20,
                      marginRight: 20,
                      borderTopColor: "#a1a1a1",
                      borderTopWidth: 1,
                      borderTopStyle: "solid",
                    }}
                  >
                    <div style={{ marginTop: 5 }}>
                      {this.state.modal.description}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              marginLeft: "15vw",
              marginTop: 130,
              height: "90vh",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 20,
                    fontWeight: 400,
                    marginBottom: 15,
                  }}
                >
                  Items near you, delivered to your doorstep every morning.
                </div>

                {/* <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 14,
                    fontWeight: 400,
                    marginBottom: 20,
                  }}
                >
                  Delivered to your doorstep in less than 24 hours.
                </div> */}
                {this.state.newItems &&
                  this.state.activeCategories &&
                  !this.state.activeCategories.includes(false) && (
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
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                          marginTop: "4vh",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: this.state.width > 960 ? 960 : 720,
                            justifyContent: "flex-end",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 26,
                              fontWeight: 500,
                              textAlign: "center",
                            }}
                          >
                            Items just added
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "flex-end",
                              width:
                                this.state.width > 960
                                  ? 960 / 2 - 100
                                  : 720 / 2 - 100,
                            }}
                          >
                            <div
                              id="prev-item"
                              onClick={() =>
                                this.scrollLeft(
                                  document.getElementById("scroll"),
                                  -300,
                                  100
                                )
                              }
                            >
                              Prev
                            </div>
                            <div
                              id="next-item"
                              onClick={() =>
                                this.scrollLeft(
                                  document.getElementById("scroll"),
                                  300,
                                  100
                                )
                              }
                            >
                              Next
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          id="scroll"
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: this.state.width > 960 ? 960 : 720,
                            overflowX: "scroll",
                            overflowY: "hidden",
                            marginTop: 20,
                            marginLeft: 20,
                            marginRight: 30,
                          }}
                        >
                          {this.state.newItems.map((item, index) => {
                            const discount = 1 - item.current_price;
                            const currentPrice =
                              item.original_price -
                              item.original_price * discount;
                            var showDecimals = true;
                            if (currentPrice % 1 == 0) {
                              // It's a while number. Don't show decimals.
                              showDecimals = false;
                            }
                            return (
                              <div
                                key={index}
                                onClick={() => this.itemPage(item)}
                                id="box"
                                style={{
                                  width: 220,
                                  marginLeft: 10,
                                  marginRight: 10,
                                  height: 300,
                                }}
                              >
                                <img
                                  src={item.pictures[0]}
                                  style={{
                                    width: 220,
                                    height: 200,
                                    borderRadius: 5,
                                    overflow: "hidden",
                                  }}
                                ></img>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <div
                                    style={{ fontSize: 18, fontWeight: 400 }}
                                  >
                                    {item.title}
                                  </div>
                                  <div
                                    style={{
                                      marginTop: 5,
                                      fontWeight: 600,
                                      fontSize: 20,
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontWeight: 600,
                                        fontSize: 20,
                                      }}
                                    >
                                      {!showDecimals &&
                                        "$" +
                                          (
                                            Math.round(currentPrice * 100) / 100
                                          ).toFixed(0)}
                                      {showDecimals &&
                                        "$" +
                                          (
                                            Math.round(currentPrice * 100) / 100
                                          ).toFixed(2)}
                                    </div>
                                    <div
                                      style={{
                                        fontWeight: 400,
                                        fontSize: 16,
                                        marginLeft: 10,
                                        color: "#cc0000",
                                        opacity:
                                          discount == 0
                                            ? 0
                                            : discount * 15 * 0.25,
                                      }}
                                    >
                                      {Math.round(discount * 100).toFixed(0) +
                                        "%"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <InfiniteScroll
                    scrollableTarget={"buy-desktop-main"}
                    children={this.state.items}
                    dataLength={this.state.items.length} //This is important field to render the next data
                    next={() => this.next()}
                    hasMore={!this.state.finishedLoading}
                    scrollThreshold={0.8}
                    loader={<h4></h4>}
                    endMessage={
                      <p style={{ textAlign: "center" }}>
                        <b>Check back often for new items</b>
                      </p>
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "70vw",
                        minHeight: "80vh",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        marginTop: 20,
                        marginLeft: 50,
                        marginRight: 50,
                      }}
                    >
                      {this.state.items.map((item, index) => {
                        if (!item) {
                          return null;
                        }

                        // If it's a category, render that title
                        if (typeof item == "string") {
                          return (
                            <div
                              id="category-title"
                              style={{
                                marginTop: 20,

                                marginBottom: 20,
                                width: "70vw",
                                textAlign: "center",
                                fontWeight: 600,
                                fontSize: 26,
                              }}
                            >
                              {item}
                            </div>
                          );
                        }

                        // Check price filter
                        if (
                          (this.state.minPrice &&
                            item.original_price < this.state.minPrice) ||
                          (this.state.maxPrice &&
                            item.original_price > this.state.maxPrice)
                        ) {
                          return null;
                        }

                        // Show discounts, if any.
                        const discount = 1 - item.current_price;
                        const currentPrice =
                          item.original_price - item.original_price * discount;
                        const f = Math.round(discount * 100).toFixed(0);

                        var showDecimals = true;
                        if (currentPrice % 1 == 0) {
                          // It's a while number. Don't show decimals.
                          showDecimals = false;
                        }
                        // Check the discount filter
                        const activeSales = this.state.activeSales;

                        if (f == 0 && !activeSales[0]) {
                          return null;
                        } else if (f == 10 && !activeSales[1]) {
                          return null;
                        } else if (f == 20 && !activeSales[2]) {
                          return null;
                        } else if (f == 30 && !activeSales[2]) {
                          return null;
                        }

                        numItemsFound++;

                        return (
                          <div>
                            <div
                              key={index}
                              onClick={() => this.itemPage(item)}
                              id="box"
                              style={{
                                width: 220,
                                marginLeft: 10,
                                marginRight: 10,
                                height: 300,
                              }}
                            >
                              <img
                                src={item.pictures[0]}
                                style={{
                                  borderStyle: "solid",
                                  borderWidth: 3,

                                  borderColor:
                                    discount == 0.8 ? " #cc0000" : "#ffffff",
                                  width: 220,
                                  height: 200,
                                  borderRadius: 5,
                                  overflow: "hidden",
                                }}
                              ></img>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <div style={{ fontSize: 18, fontWeight: 400 }}>
                                  {item.title}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 5,
                                  }}
                                >
                                  <div
                                    style={{
                                      fontWeight: 600,
                                      fontSize: 20,
                                    }}
                                  >
                                    {!showDecimals &&
                                      "$" +
                                        (
                                          Math.round(currentPrice * 100) / 100
                                        ).toFixed(0)}
                                    {showDecimals &&
                                      "$" +
                                        (
                                          Math.round(currentPrice * 100) / 100
                                        ).toFixed(2)}
                                  </div>
                                  <div
                                    style={{
                                      fontWeight: 400,
                                      fontSize: 16,
                                      marginLeft: 10,
                                      color: "#cc0000",
                                      opacity:
                                        discount == 0
                                          ? 0
                                          : discount * 15 * 0.25,
                                    }}
                                  >
                                    {f + "%"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {
                        // numItemsFound == 0 &&
                        //   !this.state.databaseEmpty &&
                        //   this.pullItemsFromDatabase(
                        //     this.state.activeCategories
                        //   )
                        // No items were found. Keep pulling from the database until we find a match.
                      }
                    </div>
                  </InfiniteScroll>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  width: "70vw",
                  height: "20vh",
                  justifyContent: "center",
                }}
              ></div>
            </div>
          </div>
        </div>
        <div style={{ position: "fixed", top: 0 }}>
          <HeaderBar updateFilter={(a, b) => this.updateFilter(a, b)} />
        </div>
        <div
          style={{
            textAlign: "center",
            fontSize: 20,
            fontWeight: 500,
            marginTop: 50,
            marginBottom: 50,
          }}
        ></div>
      </div>
    );
  }

  changeModalImg(pictureIndex) {
    this.setState({
      modalPictureIndex: pictureIndex,
    });
  }

  setMixpanel(mixpanel) {
    mixpanel.track("Video play", {
      genre: "hip-hop",
      "duration in seconds": 42,
    });
  }

  updateMoreFilter(a, b) {
    const type = a;
    const gender = b;
    this.setState({
      activeClothingType: type,
      activeClothingGender: gender,
    });
  }

  next() {
    if (this.state.finishedPullingItems) {
      this.pullItemsFromDatabase(this.state.activeCategories);
    }
  }

  itemPage(item) {
    // Add modal id as a string to the URL
    window.history.replaceState(
      null,
      null,
      "/?item=" + item.uid + "&itemcategory=" + item.category
    );
    this.setState({
      modal: item,
    });
  }

  closeModal(e) {
    window.history.replaceState(null, null, "/");
    this.setState({
      modal: null,
      modalPictureIndex: 0,
    });
  }

  addToCart(item) {
    // mixpanel.track("Video play", {
    //   genre: "hip-hop",
    //   "duration in seconds": 42,
    // });

    // mixpanel.identify(firebase.auth().currentUser.uid);
    // var USER_SIGNUP_DATE = "2020-01-02T21:07:03Z";

    // mixpanel.people.set({
    //   $email: "jsmith@example.com", // only reserved properties need the $
    //   "Sign up date": USER_SIGNUP_DATE, // Send dates in ISO timestamp format (e.g. "2020-01-02T21:07:03Z")
    //   USER_ID: USER_ID, // use human-readable names
    //   credits: 150, // ...or numbers
    // });

    var numCartItems = localStorage.getItem("cart");
    if (numCartItems && numCartItems != 0) {
      numCartItems = parseInt(numCartItems) + 1;
    } else {
      numCartItems = 1;
    }

    this.setState({
      addingToCart: true,
    });

    var myUid = null;

    if (firebase.auth().currentUser) {
      // Signed in
      myUid = firebase.auth().currentUser.uid;
    } else if (localStorage.getItem("tempUid")) {
      // temporarily signed in
      myUid = localStorage.getItem("tempUid");
    } else {
      // Not signed in
      myUid = null;
    }

    if (!myUid) {
      // Create a new temporary user
      const uid = this.randomNumber(20);
      localStorage.setItem("tempUid", uid);
      firebase
        .firestore()
        .collection("Users")
        .doc(uid)
        .set({
          cart: [item],
          orders: [],
          sales: [],
          temporary: true,
        })
        .then(() => {
          localStorage.setItem("cart", 1);
          window.history.replaceState(null, null, "/");

          this.setState({
            modal: null,
            modalPictureIndex: 0,
            addingToCart: false,
            numCartItems: 1,
          });
        });
    } else {
      firebase
        .firestore()
        .collection("Users")
        .doc(myUid)
        .get()
        .then((me) => {
          if (!me.exists) {
            firebase
              .firestore()
              .collection("Users")
              .doc(myUid)
              .set({
                cart: [],
                temporary: true,
                orders: [],
                sales: [],
              })
              .then(() => {
                firebase
                  .firestore()
                  .collection("Users")
                  .doc(myUid)
                  .get()
                  .then((me) => {
                    const myCart = me.data().cart;
                    for (var i = 0; i < myCart.length; i++) {
                      if (myCart[i].uid == item.uid) {
                        alert("Item already in your cart!");
                        window.history.replaceState(null, null, "/");

                        this.setState({
                          modal: null,
                          modalPictureIndex: 0,
                          addingToCart: false,
                          numCartItems: numCartItems,
                        });

                        return;
                      }
                    }

                    myCart.push(item);
                    firebase
                      .firestore()
                      .collection("Users")
                      .doc(myUid)
                      .update({
                        cart: myCart,
                      })
                      .then(() => {
                        localStorage.setItem("cart", numCartItems);
                        window.history.replaceState(null, null, "/");
                        this.setState({
                          modal: null,
                          modalPictureIndex: 0,
                          addingToCart: false,
                          numCartItems: numCartItems,
                        });
                      });
                  });
              });
          } else {
            const myCart = me.data().cart;
            for (var i = 0; i < myCart.length; i++) {
              if (myCart[i].uid == item.uid) {
                alert("Item already in your cart!");
                window.history.replaceState(null, null, "/");
                this.setState({
                  modal: null,
                  modalPictureIndex: 0,
                  addingToCart: false,
                  numCartItems: numCartItems,
                });
                return;
              }
            }

            myCart.push(item);
            firebase
              .firestore()
              .collection("Users")
              .doc(myUid)
              .update({
                cart: myCart,
              })
              .then(() => {
                localStorage.setItem("cart", numCartItems);
                window.history.replaceState(null, null, "/");
                this.setState({
                  modal: null,
                  modalPictureIndex: 0,
                  addingToCart: false,
                  numCartItems: numCartItems,
                });
              });
          }
        });
    }
  }

  randomNumber(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  checkCategory(item) {
    const itemCategory = item.category;
    const activeCategories = this.state.activeCategories;
    if (itemCategory == "Art & Decoration") {
      return activeCategories[0] == true;
    } else if (itemCategory == "Books") {
      return activeCategories[1] == true;
    } else if (itemCategory == "Clothing, Shoes, & Accessories") {
      return activeCategories[2] == true;
    } else if (itemCategory == "Electronics") {
      return activeCategories[3] == true;
    } else if (itemCategory == "Home") {
      return activeCategories[4] == true;
    } else if (itemCategory == "Garden") {
      return activeCategories[5];
    } else if (itemCategory == "Pet Supplies") {
      return activeCategories[6];
    } else if (itemCategory == "Sports & Hobbies") {
      return activeCategories[7];
    } else if (itemCategory == "Toys & Games") {
      return activeCategories[8];
    } else {
      return true;
    }
  }

  pullItemsFromDatabase(categories, reset, first) {
    if (reset) {
      this.state.items = [];
      this.state.currentCategoryIndex = 0;
      this.state.finalDoc = 0;
      this.state.finishedLoading = false;
    }
    const categoryList = [
      "Art & Decoration",
      "Books",
      "Clothing, Shoes, & Accessories",
      "Electronics",
      "Home",
      "Garden",
      "Pet Supplies",
      "Sports & Hobbies",
      "Toys & Games",
      // "Everything Else",
    ];

    // Keep track of an index for each category.
    // Keep track of the category we are currently on.
    // Once we get through a category, go to the next one

    const firebaseCats = firebase.firestore().collection("Categories");
    var i_index = 0;
    var itemArr = [];
    if (this.state.items) {
      itemArr = this.state.items;
    }
    var currentCategoryIndex = this.state.currentCategoryIndex;
    var currentCategory = categoryList[currentCategoryIndex];

    if (!categories[currentCategoryIndex]) {
      var found = false;
      //Loop through and find the next occourance
      for (var i = currentCategoryIndex; i < categories.length; i++) {
        if (categories[i] == true) {
          currentCategory = categoryList[i];
          itemArr.push(currentCategory);
          currentCategoryIndex = i;
          this.state.currentCategoryIndex = i;
          found = true;
          break;
        }
      }
      if (!found) {
        this.setState({
          finishedLoading: true,
        });
        return;
      }
    } else if (!itemArr.includes(currentCategory)) {
      itemArr.push(currentCategory);
    }

    firebase
      .firestore()
      .collection("Categories")
      .doc(currentCategory)
      .collection("All")
      .where("location", "==", "Austin, TX")
      .orderBy("uid")
      .limit(20)
      .startAfter(this.state.finalDoc)
      .get()
      .then((allItems) => {
        const allItemsDocs = allItems.docs;
        const finalDoc = allItemsDocs[allItemsDocs.length - 1];

        randomizeArray(allItemsDocs);

        for (var j = 0; j < allItemsDocs.length; j++) {
          const itemData = allItemsDocs[j].data();
        }

        if (allItems.empty) {
          if (this.state.currentCategoryIndex == categoryList.length - 1) {
            this.setState({
              finishedLoading: true,
              databaseEmpty: true,
            });
          } else {
            if (this.state.currentCategoryIndex != categoryList.length - 1) {
              // if (itemArr.includes(categoryList[currentCategoryIndex + 1])) {
              //   return;
              // }
              // itemArr.push(categoryList[currentCategoryIndex + 1]);
            }
            // Go to the next category
            this.setState({
              currentCategoryIndex: currentCategoryIndex + 1,
              items: itemArr,
              loaded: true,
              newCategory: true,
              modal: null,
              modalPictureIndex: 0,
              finalDoc: 0,
            });
            this.state.finishedPullingItems = false;
            this.pullItemsFromDatabase(categories);
          }
        } else if (allItemsDocs.length < 20) {
          // Go to the next category

          for (var j = 0; j < allItemsDocs.length; j++) {
            const itemData = allItemsDocs[j].data();
            itemArr.push(itemData);
            // Find a way to render all the items here
            if (j === allItemsDocs.length - 1) {
              if (this.state.currentCategoryIndex != categoryList.length - 1) {
                // if (itemArr.includes(categoryList[currentCategoryIndex + 1])) {
                //   return;
                // }
                // itemArr.push(categoryList[currentCategoryIndex + 1]);
              }
              this.setState({
                items: itemArr,
                loaded: true,
                modal: null,
                modalPictureIndex: 0,
                finalDoc: 0,
                currentCategoryIndex: currentCategoryIndex + 1,
                newCategory: true,
                currentItemIndex:
                  this.state.currentItemIndex + allItemsDocs.length,
              });
            }
          }

          this.state.finishedPullingItems = false;
          this.pullItemsFromDatabase(categories);
        } else {
          for (var j = 0; j < allItemsDocs.length; j++) {
            const itemData = allItemsDocs[j].data();
            // See if the search matches
            itemArr.push(itemData);
            // Find a way to render all the items here
            if (j === allItemsDocs.length - 1) {
              if (
                this.state.currentCategoryIndex == 0 &&
                this.state.currentItemIndex == 0
              ) {
                // alert(categoryList[this.state.currentCategoryIndex]);
                // itemArr.unshift(categoryList[this.state.currentCategoryIndex]);
              }
              // itemArr = randomizeArray(itemArr);
              this.setState({
                items: itemArr,
                loaded: true,
                finishedPullingItems: true,
                newCategory:
                  this.state.currentCategoryIndex == 0 ? true : false,
                modal: null,
                modalPictureIndex: 0,
                finalDoc: finalDoc,
                currentItemIndex: this.state.currentItemIndex + 20,
              });
            }
          }
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  }

  pullNewItemsFromDatabase() {
    const categoryList = [
      "Art & Decoration",
      "Books",
      "Clothing, Shoes, & Accessories",
      "Electronics",
      "Home",
      "Garden",
      "Pet Supplies",
      "Sports & Hobbies",
      "Toys & Games",
      "Everything Else",
    ];

    const finalArr = [];
    var i_index = 0;
    for (var i = 0; i < categoryList.length; i++) {
      const category = categoryList[i];
      firebase
        .firestore()
        .collection("Categories")
        .doc(category)
        .collection("All")
        .where("current_price", "==", 1)
        .get()
        .then((allDocs) => {
          i_index++;
          if (allDocs.docs.length === 0) {
            if (i_index == categoryList.length) {
              // Found everything. Set state
              randomizeArray(finalArr);

              this.setState({
                newItems: finalArr,
                foundNewItems: true,
              });
            }
          }
          for (var j = 0; j < allDocs.docs.length; j++) {
            const doc = allDocs.docs[j];
            finalArr.push(doc.data());
            if (
              i_index == categoryList.length &&
              j == allDocs.docs.length - 1
            ) {
              randomizeArray(finalArr);

              // Found everything. Set state
              this.setState({
                newItems: finalArr,
                foundNewItems: true,
              });
            }
          }
        });
    }
  }

  updateSaleFilter(sales) {
    this.setState({
      activeSales: sales,
    });
  }

  updateCategoryFilter(category) {
    const newCategories = [];
    for (var i = 0; i < this.state.activeCategories.length; i++) {
      if (i == category || category == -1) {
        newCategories.push(true);
      } else {
        newCategories.push(false);
      }
    }
    this.setState({
      activeCategories: newCategories,
      currentCategoryIndex: 0,
      finishedLoading: false,
      items: [],
      modal: null,
      modalPictureIndex: 0,
      finalDoc: 0,
    });
    this.pullItemsFromDatabase(newCategories, true);
  }

  updateFilter(min, max) {
    min = min.substring(1, min.length);
    max = max.substring(1, max.length);
    this.setState({
      minPrice: min,
      maxPrice: max,
    });
  }

  goToCategory(cat) {
    //  window.open("https://collection.deals/shop/" + cat.link, "_self");
    if (window.location.href.includes("localhost")) {
      window.open("http://localhost:3000/shop/?category=" + cat.link, "_self");
    } else {
      window.open(
        "https://collection.deals/shop/?category=" + cat.link,
        "_self"
      );
    }
  }

  loadPage(index) {
    if (!this.state.loaded && index == 5) {
      this.setState({
        loaded: true,
      });
    }
  }

  scrollLeft(element, change, duration) {
    var start = element.scrollLeft,
      currentTime = 0,
      increment = 20;

    const t = this;
    const st = this.state;
    var animateScroll = function () {
      currentTime += increment;

      if (change > 0) {
        if (st.width > 960) {
          element.scrollLeft = element.scrollLeft + 960 / 5;
        } else {
          element.scrollLeft = element.scrollLeft + 720 / 5;
        }
      } else {
        if (st.width > 960) {
          element.scrollLeft = element.scrollLeft - 960 / 5;
        } else {
          element.scrollLeft = element.scrollLeft - 720 / 5;
        }
      }
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({
      width: window.innerWidth - window.innerWidth * (15 / 100),
      height: window.innerHeight,
    });
  }
}
