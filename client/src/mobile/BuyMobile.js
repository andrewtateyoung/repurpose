import React from "react";
import "../css/Buy.css";
import "../css/BuyMobile.css";
import InfiniteScroll from "react-infinite-scroll-component";
import Close from "../images/close.png";
import HeaderBar from "../HeaderBar";
import * as firebase from "firebase";
import randomizeArray from "../global_methods/randomizeArray";
import FilterBar from "../FilterBar";
import Back from "../images/back.png";
import Front from "../images/arrow.png";
import HeaderMobile from "./HeaderMobile";
import FooterMobile from "./FooterMobile";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SearchPageMobile from "./SearchPageMobile";
import Div100vh from "react-div-100vh";
import AboutPageMobile from "./AboutPageMobile";
import ProfilePageMobile from "./ProfilePageMobile";
import LoadingPage from "../LoadingPage";
import ItemModal from "./ItemModal";
import ItemScroller from "./ItemScroller";
import Item from "./Item";
import Treasure from "../images/treasureGIMP.png";

export default class BuyMobile extends React.Component {
  constructor(props) {
    super(props);

    // What are we looking at?
    const q = window.location.search;
    const urlParams = new URLSearchParams(q);
    var page = urlParams.get("page");

    var item = urlParams.get("item");
    var itemCategory = urlParams.get("itemcategory");

    this.state = {
      loaded: false,
      currentCategoryIndex: 0,
      items: [],
      finalDoc: 0,
      addingToCart: false,
      activeCategories: [true, true, true, true, true, true, true, true, true],
      activeSales: [true, true, true, true, true, true],
      finishedPullingItems: false,
      finishedLoading: false,
      width: 0,
      height: 0,
      emptyArray: false,
      timer1: this.getTimerValue("timer1"),
      timesPulledFromOther: 0,
      justAddedItems: [],
      justDroppedItems: [],
      cheapItems: [],
      profileData: null,
      activePage: page,
      homePage: true,
    };

    this.state.finishedPullingItems = false;

    this.pullItemsFromDatabase(
      this.state.activeCategories,
      null,
      this.state.activeSales,
      this.state.activePage
    );
    // if (!page && !itemCategory) {
    this.pullOtherItemsFromDatabase(
      this.state.activeCategories,
      this.state.activeSales,
      "Just dropped in price"
    );
    this.pullOtherItemsFromDatabase(
      this.state.activeCategories,
      this.state.activeSales,
      "Just added"
    );
    this.pullOtherItemsFromDatabase(
      this.state.activeCategories,
      this.state.activeSales,
      "Cheapest of the cheap"
    );
    // }
  }

  shouldReturnLoadingPage(page, item) {
    const loaded = this.state.loaded;
    const timesPulledFromOther = this.state.timesPulledFromOther;

    // General case.
    if (loaded && timesPulledFromOther == 3) {
      return false;
    }
    // Page open, wait for it to load.
    else if (page && loaded) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    // Get all our params from the window.
    // 1) Are we looking at an item?
    // 2) Are we looking at a category?
    // 3) Are we looking at a page?
    const q = window.location.search;
    const urlParams = new URLSearchParams(q);
    const page = urlParams.get("page");
    var item = urlParams.get("item");
    var itemCategory = urlParams.get("itemcategory");

    // Don't load the page till we have our data
    if (this.shouldReturnLoadingPage(page, item)) {
      return (
        <div>
          <LoadingPage />
        </div>
      );
    }

    // Get the proper category
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
        <div>
          <LoadingPage />
        </div>
      );
    }
    if (city) {
      localStorage.setItem("city", city);
    }

    return (
      <div style={{ overflowX: "hidden", width: "100vw" }}>
        {!this.state.aboutPage && (
          <div style={{ position: "fixed", top: 0, zIndex: 100 }}>
            <HeaderMobile
              updatePageFilter={(page) => this.openScrollerPage(page)}
              closePage={() => this.closeScrollerPage()}
              page={page != null ? this.state.activePage : null}
              updateSalesFilter={(sales) => this.updateSalesFilter(sales)}
              updateCategoryFilter={(a, b) => this.updateCategoryFilter(a, b)}
              setPriceFilter={(a, b) => this.updateFilter(a, b)}
            />
          </div>
        )}
        <div style={{ position: "fixed", bottom: 0, zIndex: 102 }}>
          <FooterMobile
            closePage={(page) => this.closePage(page)}
            openPage={(page) => this.openPage(page)}
            updateFilter={(a, b) => this.updateFilter(a, b)}
          />
        </div>
        {this.state.aboutPage && (
          <div style={{ top: 0, height: "90vh", zIndex: 100 }}>
            <AboutPageMobile closePage={() => this.closePage()} />
          </div>
        )}
        {this.state.searchPage && (
          <div style={{ height: "90vh", zIndex: 100 }}>
            <SearchPageMobile closePage={() => this.closePage()} />
          </div>
        )}
        {this.state.profilePage && (
          <ProfilePageMobile
            redirectToCheckout={this.state.redirectToCheckout}
            closePage={() => this.closePage()}
          />
        )}
        {!this.state.loaded && (
          <div>
            <LoadingPage />
          </div>
        )}
        {this.state.modal && (
          <ItemModal
            addingToCart={this.state.addingToCart}
            closeModal={() => this.closeModal()}
            item={this.state.modal}
            addToCart={(item) => this.addToCart(item)}
          />
        )}
        <div
          style={{
            display: !this.state.loaded ? "none" : "block",
            overflowX: "hidden",
          }}
        >
          <div
            id="buy-mobile-main"
            style={{
              marginTop: "8vh",
              zIndex: 99,
              overflowX: "hidden",
              width: "100vw",
              overflowY: this.state.homePage ? "scroll" : "hidden",
              height: this.state.homePage && !this.state.modal ? "88vh" : 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100vw",
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
                  onClick={() => (window.location.href = "/")}
                  id="bar"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 40,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Pridi",
                      fontWeight: 700,
                      marginLeft: 20,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: 32,
                      color: "#426CB4",
                    }}
                  >
                    Tate's
                  </div>
                  <div
                    style={{
                      fontFamily: "Pridi",
                      fontWeight: 700,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: 32,
                      color: "#AF7366",
                      marginLeft: 5,
                    }}
                  >
                    Crate
                  </div>
                  <img
                    style={{ width: 50, height: 50, marginLeft: 20 }}
                    src={Treasure}
                  ></img>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    marginTop: "2vh",
                    fontSize: 16,
                    fontWeight: 500,
                    width: "100vw",
                    borderBottomWidth: 1.5,
                    borderBottomStyle: "solid",
                    borderBottomColor: "lightgrey",
                    paddingBottom: 20,
                    fontFamily: "Gill Sans",
                  }}
                >
                  Cheap, used items near you, delivered every morning.
                </div>
                {
                  // This is our item scroller component.
                  !this.activeFilter("sales") &&
                    !this.activeFilter("categories") &&
                    !this.state.emptyArray &&
                    !this.state.activePage && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "Gill Sans",
                            paddingLeft: 10,
                            fontSize: 18,
                            marginTop: 20,
                          }}
                        >
                          {this.state.timer1}
                        </div>
                        <ItemScroller
                          heartedItem={
                            this.props.profileData &&
                            this.props.profileData.hearted_items &&
                            this.props.profileData.hearted_items.includes(
                              item.uid
                            )
                          }
                          profilePage={() =>
                            this.setState({
                              profile: true,
                            })
                          }
                          openScrollerPage={(page) =>
                            this.openScrollerPage(page)
                          }
                          title={"Just dropped in price"}
                          itemPage={(item) => this.itemPage(item)}
                          items={this.state.justDroppedItems}
                        />
                        <ItemScroller
                          heartedItem={
                            this.props.profileData &&
                            this.props.profileData.hearted_items &&
                            this.props.profileData.hearted_items.includes(
                              item.uid
                            )
                          }
                          profilePage={() =>
                            this.setState({
                              profile: true,
                            })
                          }
                          openScrollerPage={(page) =>
                            this.openScrollerPage(page)
                          }
                          title={"Just added"}
                          itemPage={(item) => this.itemPage(item)}
                          items={this.state.justAddedItems}
                        />
                        <ItemScroller
                          heartedItem={
                            this.props.profileData &&
                            this.props.profileData.hearted_items &&
                            this.props.profileData.hearted_items.includes(
                              item.uid
                            )
                          }
                          profilePage={() =>
                            this.setState({
                              profile: true,
                            })
                          }
                          openScrollerPage={(page) =>
                            this.openScrollerPage(page)
                          }
                          title={"Cheapest of the cheap"}
                          itemPage={(item) => this.itemPage(item)}
                          items={this.state.cheapItems}
                        />
                      </div>
                    )
                }

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <InfiniteScroll
                    scrollableTarget={"buy-mobile-main"}
                    children={this.state.items}
                    dataLength={this.state.items.length} //This is important field to render the next data
                    next={() => this.next()}
                    hasMore={!this.state.finishedLoading}
                    scrollThreshold={0.7}
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
                        width: "100vw",
                        overflowX: "hidden",
                        minHeight: "80vh",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      {this.state.items.map((item, index) => {
                        if (!item) {
                          return null;
                        }
                        return (
                          <div>
                            {typeof item == "string" &&
                              !this.state.activePage &&
                              !this.checkIfEmptyArray() && (
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
                              )}
                            {typeof item != "string" && (
                              <Item
                                item={item}
                                index={index}
                                itemPage={(item) => this.itemPage(item)}
                              ></Item>
                            )}
                          </div>
                        );

                        // Show discounts, if any.
                      })}
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
                  height: "15vh",
                  justifyContent: "center",
                }}
              ></div>
            </div>
          </div>
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

  closePage(page) {
    if (page == "homePage") {
      this.setState({
        homePage: false,
        aboutPage: false,
        searchPage: false,
        profilePage: false,
      });
    } else if (page == "aboutPage") {
      this.setState({
        homePage: false,
        aboutPage: false,
        searchPage: false,
        profilePage: false,
      });
    } else if (page == "searchPage") {
      this.setState({
        homePage: false,
        aboutPage: false,
        searchPage: false,
        profilePage: false,
      });
    } else if (page == "profilePage") {
      this.setState({
        homePage: false,
        aboutPage: false,
        searchPage: false,
        profilePage: false,
      });
    }
  }

  openPage(page) {
    if (page == "homePage") {
      this.setState({
        homePage: true,
        aboutPage: false,
        searchPage: false,
        profilePage: false,
      });
    } else if (page == "aboutPage") {
      this.setState({
        homePage: false,
        aboutPage: true,
        searchPage: false,
        profilePage: false,
      });
    } else if (page == "searchPage") {
      this.setState({
        homePage: false,
        aboutPage: false,
        searchPage: true,
        profilePage: false,
      });
    } else if (page == "profilePage") {
      this.setState({
        homePage: false,
        aboutPage: false,
        searchPage: false,
        profilePage: true,
      });
    }
  }

  next() {
    if (this.state.finishedPullingItems) {
      this.state.finishedPullingItems = false;
      this.pullItemsFromDatabase(
        this.state.activeCategories,
        false,
        this.state.activeSales,
        this.state.activePage,
        0
      );
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
          cart_uids: [item.uid],
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
                cart_uids: [],
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
                    const myCartUids = me.data().cart_uids;
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
                    myCartUids.push(item.uid);
                    firebase
                      .firestore()
                      .collection("Users")
                      .doc(myUid)
                      .update({
                        cart: myCart,
                        cart_uids: myCartUids,
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
            const myCartUids = me.data().cart_uids;
            for (var i = 0; i < myCart.length; i++) {
              if (myCart[i].uid == item.uid) {
                alert("Item already in your cart!");
                window.history.replaceState(null, null, "/");

                this.setState({
                  modal: null,
                  addingToCart: false,
                  numCartItems: numCartItems,
                });
                return;
              }
            }

            myCart.push(item);
            myCartUids.push(item.uid);
            firebase
              .firestore()
              .collection("Users")
              .doc(myUid)
              .update({
                cart: myCart,
                cart_uids: myCartUids,
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

  // Do we have an active filter?
  activeFilter(type) {
    // Check the sale filter
    if (type == "sale") {
      return this.state.activeSales.includes(false);
    }
    // Check the category filter
    else {
      return this.state.activeCategories.includes(false);
    }
  }

  // Main pull! Pull items to show in the main section.
  pullItemsFromDatabase(categories, reset, sales, page, currentCategoryI) {
    var PULL_NUM = 8;
    if (page && page != "") {
      PULL_NUM = 9999;
    }
    if (reset) {
      this.state.items = [];
      this.state.finalDoc = 0;
      this.state.loaded = false;
      this.state.currentCategoryIndex = 0;
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
      "Everything Else",
    ];

    // Get our current category index & Category
    var currentCategoryIndex = this.state.currentCategoryIndex;
    var currentCategory = categoryList[currentCategoryIndex];

    // Is this a single category?
    const singleCategory = categories.includes(false);

    // Our item list
    const itemArr = [];

    // Are we done?
    if (currentCategoryIndex >= categoryList.length) {
      this.setState({
        loaded: true,
      });
    }

    // Looking at  asingle category?
    if (singleCategory) {
      for (var i = 0; i < categories.length; i++) {
        if (categories[i] == true) {
          this.state.currentCategoryIndex = i;
          currentCategory = categoryList[i];
          currentCategoryIndex = i;
          if (reset) {
            itemArr.push(currentCategory);
          }
          break;
        }
      }
    } else {
      // Looking at all categories? Iterate
      currentCategory = categoryList[currentCategoryIndex];
      if (!this.state.items.includes(currentCategory)) {
        itemArr.push(currentCategory);
      }
    }

    // Set our sale filter
    const saleArray = [];
    for (var i = 0; i < sales.length; i++) {
      const activeSale = sales[i];
      if (activeSale) {
        const saleNum = Math.round((1 - parseInt(i * 10) / 100) * 10) / 10;
        saleArray.push(saleNum);
        // Special case: 50%+
        if (i == 5) {
          saleArray.push(0.4);
          saleArray.push(0.3);
          saleArray.push(0.2);
        }
      }
    }

    // Get all the items that match our location and our current_price.

    var pullVariable = firebase
      .firestore()
      .collection("Categories")
      .doc(currentCategory)
      .collection("All")
      .where("location", "==", "Austin, TX")
      .where("current_price", "in", saleArray)
      .orderBy("uid")
      .limit(PULL_NUM)
      .startAfter(this.state.finalDoc)
      .get();

    const pullNewItems = firebase
      .firestore()
      .collection("Categories")
      .doc(currentCategory)
      .collection("All")
      .where("location", "==", "Austin, TX")
      .where("new_discount", "==", true)
      .orderBy("uid")
      .limit(PULL_NUM)
      .startAfter(this.state.finalDoc)
      .get();

    if (page == "Just dropped in price") {
      pullVariable = pullNewItems;
    }

    pullVariable
      .then((allItems) => {
        // console.log('pulling from database');
        const allItemsDocs = allItems.docs;
        const finalDoc = allItemsDocs[allItemsDocs.length - 1];
        const emptyArray = this.checkIfEmptyArray();

        // Array is empty. Either done, or go to the next category.
        if (allItems.empty) {
          //Finished the final category. Done.
          if (currentCategoryIndex == categoryList.length - 1) {
            this.setState({
              loaded: true,
              emptyArray: emptyArray,
              activePage: page ? page : this.state.activePage,
              activeSales: sales,
              currentCategoryIndex: currentCategoryIndex,
            });
          } else {
            // Go to the next category
            if (!singleCategory) {
              this.setState({
                currentCategoryIndex: currentCategoryIndex + 1,
                items: [...this.state.items, ...itemArr],
                loaded: false,
                modal: null,
                finalDoc: 0,
                activePage: page ? page : this.state.activePage,
                currentCategoryIndex: currentCategoryIndex + 1,
                activeSales: sales,
              });
              this.state.finishedPullingItems = false;

              this.pullItemsFromDatabase(
                categories,
                false,
                sales,
                page,
                currentCategoryIndex + 1
              );
            } else {
              this.setState({
                loaded: true,
                emptyArray: emptyArray,

                items: [...this.state.items, ...itemArr],
                modal: null,
                finalDoc: 0,
                finishedPullingItems: false,
              });
            }
            // console.log('next category pull.');
          }
        }
        // Done with the category. Go to the next one.
        else if (allItemsDocs.length < PULL_NUM) {
          for (var j = 0; j < allItemsDocs.length; j++) {
            const itemData = allItemsDocs[j].data();
            itemArr.push(itemData);
            // Set the state on the last item.
            if (j === allItemsDocs.length - 1) {
              this.setState({
                items: [...this.state.items, ...itemArr],
                modal: null,
                modalPictureIndex: 0,
                finalDoc: 0,
                currentCategoryIndex: currentCategoryIndex + 1,
                emptyArray: false,
                activePage: page ? page : this.state.activePage,
                currentCategoryIndex: currentCategoryIndex + 1,
                activeSales: sales,
              });
            }
          }
          this.state.finishedPullingItems = false;
          // console.log('items less than pull, ');

          // Any categories left?
          if (!singleCategory) {
            this.pullItemsFromDatabase(
              categories,
              false,
              sales,
              page,
              currentCategoryIndex + 1
            );
          } else {
            this.setState({
              loaded: true,
            });
          }
        } else {
          // No issues, all items pulled properly.
          // console.log('no issues. stop pull');
          for (var j = 0; j < allItemsDocs.length; j++) {
            const itemData = allItemsDocs[j].data();
            itemArr.push(itemData);

            // Set the state on the last item.
            if (j === allItemsDocs.length - 1) {
              this.setState({
                items: [...this.state.items, ...itemArr],
                loaded: true,
                finishedPullingItems: true,
                modal: null,
                modalPictureIndex: 0,
                finalDoc: finalDoc,
                emptyArray: false,
                activePage: page ? page : this.state.activePage,
                activeSales: sales,
                currentCategoryIndex: currentCategoryIndex,
              });
            }
          }
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  }

  // Open the proper page, if we're looking at one.
  openScrollerPage(page) {
    const newCategories = [
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
    ];
    const newSales = [true, true, true, true, true, true];
    if (page == "Just dropped in price") {
      // Pull items that just dropped in price
      window.history.replaceState(null, null, "/?page=" + page);

      this.pullItemsFromDatabase(newCategories, true, newSales, page, 0);
    } else if (page == "Just added") {
      // Pull items where current_price == 1.0
      window.history.replaceState(null, null, "/?page=" + page);
      const sales = [true, false, false, false, false, false];
      this.pullItemsFromDatabase(newCategories, true, sales, page, 0);
    } else if (page == "Cheapest of the cheap") {
      // Pull items where current_price is <= 0.4
      window.history.replaceState(null, null, "/?page=" + page);
      const sales = [false, false, false, false, false, true];
      this.pullItemsFromDatabase(newCategories, true, sales, page, 0);
    }
  }

  closeScrollerPage() {
    const sales = [true, true, true, true, true, true];
    this.setState({
      activePage: null,
      activeSales: sales,
    });
    window.history.replaceState(null, null, "/");
    this.pullItemsFromDatabase(this.state.activeCategories, true, sales, 0);
  }

  // Secondary pull! Show items that show up in the <ItemScroller />
  async pullOtherItemsFromDatabase(categories, sales, page) {
    const categoryList = [
      "Art & Decoration",
      "Books",
      "Clothing, Shoes, & Accessories",
      // 'Electronics',
      "Home",
      "Garden",
      // 'Pet Supplies',
      "Sports & Hobbies",
      "Toys & Games",
      "Everything Else",
    ];

    // What will we call this in state?
    var stateRef = "";
    const finalArr = [];
    var i_index = 0;
    for (var i = 0; i < categoryList.length; i++) {
      const category = categoryList[i];

      const firebaseRef = firebase
        .firestore()
        .collection("Categories")
        .doc(category)
        .collection("All");

      var pullingRef = null;

      // Just dropped items
      if (page == "Just dropped in price") {
        stateRef = "justDroppedItems";
        pullingRef = firebaseRef
          .where("location", "==", "Austin, TX")
          .where("new_discount", "==", true)
          .orderBy("uid")
          .limit(6)
          .startAfter(this.state.finalDoc);
      } else if (page == "Just added") {
        stateRef = "justAddedItems";
        pullingRef = firebaseRef
          .where("location", "==", "Austin, TX")
          .where("current_price", "==", 1)
          .orderBy("uid")
          .limit(6)
          .startAfter(this.state.finalDoc);
      } else if (page == "Cheapest of the cheap") {
        stateRef = "cheapItems";
        pullingRef = firebaseRef
          .where("location", "==", "Austin, TX")
          .where("current_price", "in", [0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1])
          .orderBy("uid")
          .limit(6)
          .startAfter(this.state.finalDoc);
      }

      pullingRef.get().then((snapshot) => {
        i_index++;
        if (snapshot.docs.length === 0) {
          if (i_index == categoryList.length) {
            randomizeArray(finalArr);
            this.setState({
              [stateRef]: finalArr,
              timesPulledFromOther: this.state.timesPulledFromOther + 1,
            });
          }
        }
        for (var j = 0; j < snapshot.docs.length; j++) {
          const doc = snapshot.docs[j];
          finalArr.push(doc.data());
          if (i_index == categoryList.length && j == snapshot.docs.length - 1) {
            randomizeArray(finalArr);
            this.setState({
              [stateRef]: finalArr,
              timesPulledFromOther: this.state.timesPulledFromOther + 1,
            });
            // Found everything. Set state
          }
        }
      });
    }
  }

  // Check if our array is empty
  checkIfEmptyArray(currentCategory) {
    // Check the category and see if it's empty. If it is, blur the title.
    if (currentCategory) {
      const items = this.state.items;
      var searchingCategory = false;
      var numItemsInCategory = 0;

      for (var i = 0; i < items.length; i++) {
        const item = items[i];
        if (searchingCategory) {
          // console.log('Searching: ' + currentCategory);
          // Hit the next category, return
          if (typeof item == "string") {
            if (numItemsInCategory == 0) {
              // console.log('Empty category: ' + currentCategory);
              return true;
            }
          } else {
            // console.log('Non-empty category: ' + currentCategory);
            return false;
          }
        }
        if (item == currentCategory) {
          // console.log('Found it: ' + currentCategory);
          searchingCategory = true;
        }
      }
    } else {
      // Check if the entire array is empty.
      var foundItem = false;
      for (var i = 0; i < this.state.items.length; i++) {
        const item = this.state.items[i];
        if (typeof item == "object") {
          foundItem = true;
          break;
        }
      }

      // If we do not contain any objects, we are empty.
      if (!foundItem) {
        return true;
      } else {
        return false;
      }
    }
  }

  updateSalesFilter(sales) {
    this.setState({
      activeSales: sales,
    });
  }

  // Update our category filter
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
      finalDoc: 0,
    });
    this.pullItemsFromDatabase(
      newCategories,
      null,
      this.state.activeSales,
      this.state.activePage
    );
  }

  goToCategory(cat) {
    //  window.open("https://tatescrate.com/shop/" + cat.link, "_self");
    if (window.location.href.includes("localhost")) {
      window.open("http://localhost:3000/shop/?category=" + cat.link, "_self");
    } else {
      window.open("https://tatescrate.com/shop/?category=" + cat.link, "_self");
    }
  }

  getTimerValue() {
    const t = this;

    setInterval(function () {
      const currentDate = new Date();
      const modNumber = currentDate.getHours() % 3;
      var hoursLeft = modNumber;
      var minutesLeft = 59 - currentDate.getMinutes();
      var secondsLeft = 59 - currentDate.getSeconds();
      if (secondsLeft.toString().length == 1) {
        secondsLeft = "0" + secondsLeft;
      }

      if (modNumber == 0) {
        hoursLeft = 2;
      } else if (modNumber == 2) {
        hoursLeft = 0;
      }
      // Check if we're wihtin the timeframe
      if (currentDate.getHours() < 8) {
        // 0 == 12:00 AM
        hoursLeft = 7 - currentDate.getHours();
      } else if (currentDate.getHours() == 23) {
        // 23 == 11:00 PM
        hoursLeft = 8;
      }
      if (hoursLeft == 0) {
        t.setState({
          timer1: "Next price drop: " + minutesLeft + ":" + secondsLeft,
        });
      } else {
        t.setState({
          timer1:
            "Next price drop: " +
            hoursLeft +
            ":" +
            minutesLeft +
            ":" +
            secondsLeft,
        });
      }
    }, 950);
  }
}
