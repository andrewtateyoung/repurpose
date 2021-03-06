import React from "react";
import Close from "../images/close.png";
import "../css/AboutPageMobile.css";
import Div100vh from "react-div-100vh";
import MobileChat from "./MobileChat";

export default class AboutPageMobile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          zIndex: 100,
          overflowY: "scroll",
          backgroundColor: "#f5f5f5",
          top: 0,
          height: "91.2vh",
        }}
      >
        <div
          style={{
            width: "100vw",
            zIndex: 101,
            borderRadius: 5,
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
              id="bar"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 10,
                paddingBottom: 10,
                fontSize: 22,
                fontWeight: 700,
                color: "#426CB4",
                marginTop: "1vh",
                // marginBottom: "2vh",
              }}
            >
              Collection
            </div>
            <div className="about-1">
              Press below, call/text 903-203-1286, or email
              andrew@collection.deals if you have any concerns or questions!
            </div>
            <MobileChat top={true} />

            <div
              className="about-2"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="about-3">Buyers: How we work</div>
              <div>
                Buy any items you want: Furniture, art, anything, and we deliver
                all of it directly to you for just $2.
              </div>
              <div>
                Yes, you can buy $100 worth of items and it's just $2 for the
                entire delivery.
              </div>
              <div>
                Items are added and prices drop everyday, up to 80%. Since we
                always have items coming in, we want to get rid of a lot of our
                inventory. Check back often for deals and new items!
              </div>
              <div onClick={() => this.closeModal()} className="about-button">
                BUY NOW
              </div>
            </div>

            <div
              className="about-2"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "2vh",
                zIndex: 50,
              }}
            >
              <div className="about-3">Sellers: How we work</div>
              <div>
                We come and pick up all the items you don't want, and pay you
                40% commission when they sell.
              </div>
              <div>
                If you have a lot of stuff you want to sell, we can make this
                happen for you seamlessly.
              </div>
              <div>
                Right now, we're dealing mainly with people who have $500+ worth
                of items.
              </div>
              <div
                onClick={() => (window.location.href = "/sell")}
                className="about-button"
              >
                SELL NOW
              </div>
              {/* <div style={{ height: "8vh" }}></div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  closeModal(e) {
    this.props.closePage();
  }
}
