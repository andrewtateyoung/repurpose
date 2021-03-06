import React from "react";
import Close from "../images/close.png";
import { MenuItem, Input, Select } from "@material-ui/core";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import "../css/SearchPageMobile.css";

export default class SearchPageMobile extends React.Component {
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
          zIndex: 1,
          alignItems: "center",
          zIndex: 101,
        }}
      >
        <div
          style={{
            width: "100vw",
            overflowY: "scroll",
            height: "91.2vh",
            zIndex: 1,
            borderRadius: 5,
            zIndex: 101,
            top: 0,
            backgroundColor: "#f5f5f5",
            alignItems: "center",
            opacity: 1,
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", zIndex: 101 }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "30vh",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Input
                  onKeyPress={(e) => this.keyPress(e)}
                  defaultValue={
                    this.props.searchTerm ? this.props.searchTerm : ""
                  }
                  id="search-input-mobile"
                  placeholder="Search for anything"
                  style={{ marginRight: 5, height: 40 }}
                />
              </div>
              <div
                onClick={() => this.keyPress("search")}
                id="search"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  // justifyContent: "center",
                  alignItems: "center",
                  fontSize: 14,
                  marginLeft: "2vw",
                  backgroundColor: "rgb(218, 226, 241)",
                  borderRadius: 5,
                  padding: "2vw",
                }}
              >
                <SearchOutlinedIcon
                  style={{
                    width: "8vw",
                    height: "8vw",
                    color: "#000000",
                  }}
                ></SearchOutlinedIcon>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  keyPress(e) {
    // Pressed icon

    if (e == "search" || e.key == "Enter") {
      const search = document.getElementById("search-input-mobile").value;
      const city = localStorage.getItem("city");
      const category = "All Categories";
      if (!search || search.trim() === "") {
        alert("Bad search");
        return;
      }
      this.closeModal();
      window.location.href =
        "/search/?" +
        "search=" +
        search +
        "&category=" +
        category +
        "&city=" +
        city;
      return;
    }
  }

  closeModal(e) {
    this.props.closePage();
  }
}
