import React from "react";
import HeaderBar from "./HeaderBar";
import _ from "lodash";
import { compose, withProps, lifecycle } from "recompose";
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox";
import api from "./api";
import * as firebase from "firebase";
import "./css/Sell_2.css";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

export default class Sell_2 extends React.Component {
  constructor(props) {
    super(props);
    const today = new Date();
    this.state = {
      markers: [],
      allMarkers: [],
      collectorArray: [],
      loaded: false,
      today: today,
      modal: false,
    };

    firebase
      .firestore()
      .collection("Collectors")
      .where("collection_city", "==", localStorage.getItem("city"))
      .get()
      .then((collectorDocs) => {
        const collectorArray = [];
        const markerArray = [];
        for (var i = 0; i < collectorDocs.docs.length; i++) {
          const collectorData = collectorDocs.docs[i].data();

          if (collectorData.type == "dropoff") {
            collectorArray.push(collectorData);
            markerArray.push({
              lat: collectorData.lat,
              lng: collectorData.lng,
            });
          }
        }
        collectorArray.reverse();
        this.setState({
          loaded: true,
          collectorArray: collectorArray,
          markers: markerArray,
          allMarkers: markerArray,
        });
      });
  }

  render() {
    if (!this.state.loaded) {
      return null;
    }
    const MapWithASearchBox = compose(
      withProps({
        googleMapURL:
          "https://maps.googleapis.com/maps/api/js?key=AIzaSyBbpHHOjcFkGJeUaEIQZ-zNVaYBw0UVfzw&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100% ` }} />,
        mapElement: <div style={{ height: `100%` }} />,
      }),
      lifecycle({
        componentWillMount() {
          const refs = {};

          this.setState({
            bounds: null,
            center: {
              lat: 32.2049,
              lng: -95.8555,
            },
            markers: [],
            hoverOverThing: (lat, lng) => {
              if (!this.state.allMarkers || !this.state.markers) {
                return null;
              }
              const temp = [];
              for (var i = 0; i < this.state.allMarkers.length; i++) {
                const marker = this.state.allMarkers[i];
                if (marker.lat == lat && marker.lng == lng) {
                  temp.push(marker);
                }
              }
              this.setState({
                markers: temp,
              });
            },
            leaveOverThing: (lat, lng) => {
              if (!this.state.allMarkers || !this.state.markers) {
                return null;
              }
              this.setState({
                markers: this.state.allMarkers,
              });
            },
            onMapMounted: (ref) => {
              refs.map = ref;
              const markerArray = [];
              firebase
                .firestore()
                .collection("Collectors")
                .where("collection_city", "==", localStorage.getItem("city"))
                .get()
                .then((collectorDocs) => {
                  var i_index = 0;
                  for (var i = 0; i < collectorDocs.docs.length; i++) {
                    const collectorData = collectorDocs.docs[i].data();
                    if (collectorData.type == "dropoff") {
                      api
                        .getLatLng(
                          collectorData.house_address,
                          collectorData.zip,
                          collectorData.city,
                          collectorData.state
                        )
                        .then((result) => {
                          i_index++;
                          const position = result.results[0].geometry.location;
                          markerArray.push(position);
                          if (i_index == collectorDocs.docs.length) {
                            this.setState({
                              markers: markerArray,
                              allMarkers: markerArray,
                            });
                          }
                        });
                    } else {
                      i_index++;
                    }
                  }
                });
            },
            onBoundsChanged: () => {
              this.setState({
                bounds: refs.map.getBounds(),
                center: refs.map.getCenter(),
              });
            },
            onSearchBoxMounted: (ref) => {
              refs.searchBox = ref;
            },
          });
        },
      }),
      withScriptjs,
      withGoogleMap
    )((props) => (
      <GoogleMap
        ref={props.onMapMounted}
        defaultZoom={11}
        center={props.center}
        onBoundsChanged={props.onBoundsChanged}
      >
        {(this.state.x = props.hoverOverThing)}
        {(this.state.y = props.leaveOverThing)}

        {props.markers.map((marker, index) => (
          <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }} />
        ))}
      </GoogleMap>
    ));

    return (
      <div style={{ minHeight: "100vh" }}>
        {this.state.modal && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              onClick={(e) => this.closeModal(e)}
              style={{
                backgroundColor: "#000000",
                opacity: 0.5,
                zIndex: 99,
                width: "100vw",
                height: "100vh",
                position: "absolute",
              }}
            ></div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "50vw",
                borderRadius: 5,
                height: "80vh",
                top: 30,
                backgroundColor: "#f5f5f5",
                alignItems: "center",
                position: "absolute",
                zIndex: 100,
                opacity: 1,
              }}
            >
              <div style={{ marginTop: 20, fontSize: 20 }}>
                {this.state.modal.name + " " + "is your collector!"}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: 50,
                    marginRight: 10,
                  }}
                >
                  <img
                    src={this.state.modal.house_picture}
                    style={{ width: 200, height: 200 }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: 50,
                    marginLeft: 10,
                  }}
                >
                  <img
                    src={this.state.modal.collector_picture}
                    style={{ width: 200, height: 250 }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 100,
                  width: "60%",
                }}
              >
                {this.state.modal.description}
              </div>
              <div style={{ marginTop: 30, fontSize: 20 }}>
                {this.state.modal.house_address}
              </div>
            </div>
          </div>
        )}
        <div>
          <HeaderBar sell={true} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 60,
            marginTop: 20,
          }}
        >
          <div
            style={{
              marginLeft: 40,
              marginRight: 10,
              width: 200,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: 500,
            }}
          >
            1. Bring your clutter / items to any location (during open hours)
          </div>
          <div
            style={{
              marginRight: 10,
              marginLeft: 10,
              width: 200,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: 500,
            }}
          >
            2. The Collector there will unload all your clutter
          </div>
          <div
            style={{
              marginLeft: 10,
              width: 200,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: 500,
            }}
          >
            3. You get paid cash on the spot
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "40vw",
              marginLeft: 20,
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 600 }}>
              Sell your clutter
            </div>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>
              Athens Locations
            </div>

            {this.state.collectorArray.map((collector, index) => {
              console.log(collector);
              return (
                <div
                  onClick={() =>
                    this.setState({
                      modal: collector,
                    })
                  }
                  id={"house"}
                  key={index}
                  onMouseEnter={() =>
                    this.highlightMarker(collector.lat, collector.lng)
                  }
                  onMouseLeave={() =>
                    this.unHighlightMarker(collector.lat, collector.lng)
                  }
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    height: 250,
                    marginTop: 5,
                    marginBottom: 5,
                  }}
                >
                  <div style={{ width: 250, marginRight: 20 }}>
                    <img
                      src={collector.house_picture}
                      style={{
                        width: 250,
                        height: 250,
                        borderRadius: 5,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: "50%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ fontSize: 18 }}>
                      {collector.house_address}
                    </div>
                    {!this.currentlyOpen(collector) && (
                      <div
                        style={{
                          marginTop: 5,
                          marginBottom: 20,
                          fontWeight: 500,
                        }}
                      >
                        Closed
                      </div>
                    )}
                    {this.currentlyOpen(collector) && (
                      <div
                        style={{
                          marginTop: 5,
                          marginBottom: 20,
                          fontWeight: 500,
                        }}
                      >
                        Open
                      </div>
                    )}

                    {collector.monday && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <div style={{ marginRight: 10, width: 90 }}>Monday</div>
                        <div>{collector.monday}</div>
                      </div>
                    )}
                    {collector.tuesday && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <div style={{ marginRight: 10, width: 90 }}>
                          Tuesday
                        </div>
                        <div>{collector.tuesday}</div>
                      </div>
                    )}
                    {collector.wednesday && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <div
                          style={{
                            marginRight: 10,
                            width: 90,
                            fontWeight: 700,
                          }}
                        >
                          Wednesday
                        </div>
                        <div style={{ fontWeight: 700 }}>11AM - 9PM</div>
                      </div>
                    )}
                    {collector.thursday && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <div style={{ marginRight: 10, width: 90 }}>
                          Thursday
                        </div>
                        <div>11AM - 9PM</div>
                      </div>
                    )}
                    {collector.friday && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <div style={{ marginRight: 10, width: 90 }}>Friday</div>
                        <div>11AM - 9PM</div>
                      </div>
                    )}
                    {collector.saturday && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <div
                          style={{
                            marginRight: 10,
                            width: 90,
                            fontWeight: 600,
                          }}
                        >
                          Saturday
                        </div>
                        <div style={{ fontWeight: 600 }}>
                          {collector.saturday}
                        </div>
                      </div>
                    )}
                    {collector.sunday && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <div style={{ marginRight: 10, width: 90 }}>Sunday</div>
                        <div>{collector.sunday}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ width: "60vw", minHeight: "70vh" }}>
            <MapWithASearchBox></MapWithASearchBox>
            {/* <MyMapComponent
              isMarkerShown={true}
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBbpHHOjcFkGJeUaEIQZ-zNVaYBw0UVfzw"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `400px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
            >
              <Marker position={{ lat: 32.2049, lng: -95.8555 }} />
            </MyMapComponent> */}
          </div>
        </div>
      </div>
    );
  }

  closeModal() {
    this.setState({
      modal: false,
    });
  }

  highlightMarker(lat, lng) {
    if (this.state.x) {
      this.state.x(lat, lng);
    }
  }

  unHighlightMarker(lat, lng) {
    if (this.state.y) {
      this.state.y(lat, lng);
    }
  }

  currentlyOpen() {
    return false;
  }
}
