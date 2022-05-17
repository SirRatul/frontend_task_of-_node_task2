import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

function Home() {
  const [degree, setDegree] = useState("");
  const [weatherType, setWeatherType] = useState("");
  const [humidity, setHumidity] = useState("");
  const [fullList, setFullList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [fromAirportList, setFromAirportList] = useState([]);
  const [toAirportList, setToAirportList] = useState([]);
  const [fromCountry, setFromCountry] = useState("Select Country");
  const [fromAirport, setFromAirport] = useState("Select Airport");
  const [toCountry, setToCountry] = useState("Select Country");
  const [toAirport, setToAirport] = useState("Select Airport");
  const [fromLat, setFromLat] = useState();
  const [fromLong, setFromLong] = useState();
  const [toLat, setToLat] = useState();
  const [toLong, setToLong] = useState();
  const [distance, setDistance] = useState();
  const navigate = useNavigate();
  const handleFromCountry = (e) => {
    setFromCountry(e);
    const fromAirportObjectList = fullList.filter((item) => {
      return item.iso_country == e;
    });
    setFromAirportList(
      Array.from(new Set(fromAirportObjectList.map(({ name }) => name)))
    );
  };
  const handleFromAirport = (e) => {
    setFromAirport(e);
    const finalFromAirport = fullList.find((item) => {
      return item.iso_country == fromCountry && item.name == e;
    });
    setFromLat(finalFromAirport.latitude_deg);
    setFromLong(finalFromAirport.longitude_deg);
  };
  const handleToCountry = (e) => {
    setToCountry(e);
    const toAirportObjectList = fullList.filter((item) => {
      return item.iso_country == e;
    });
    setToAirportList(
      Array.from(new Set(toAirportObjectList.map(({ name }) => name)))
    );
  };
  const handleToAirport = (e) => {
    setToAirport(e);
    const finalToAirport = fullList.find((item) => {
      return item.iso_country == toCountry && item.name == e;
    });
    setToLat(finalToAirport.latitude_deg);
    setToLong(finalToAirport.longitude_deg);
    console.log(
      fromLat,
      fromLong,
      finalToAirport.latitude_deg,
      finalToAirport.longitude_deg
    );
  };

  const rad2deg = (value) => {
    return (value * Math.PI) / 180;
  };

  const deg2rad = (value) => {
    return value * (Math.PI / 180);
  };

  const distanceFunc = (lat1, lon1, lat2, lon2, unit) => {
    let theta = lon1 - lon2;
    let dist =
      Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.cos(deg2rad(theta));
    dist = Math.acos(dist);
    dist = rad2deg(dist);
    dist = dist * 60 * 1.1515;
    if (unit === "K") {
      dist = dist * 1.609344;
    } else if (unit === "N") {
      dist = dist * 0.8684;
    }
    return dist;
  };
  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(
          `http://api.weatherapi.com/v1/current.json?key=fa771f5cfac44990aab125925221605 &q=Dhaka`
        )
        .then((res) => {
          console.log(res.data);
          setDegree(res.data.current.temp_c + " degree");
          setWeatherType(res.data.current.condition.text);
          setHumidity(res.data.current.humidity);
        });
      axios.get(`http://localhost:5000/convertToJson`).then((res) => {
        console.log(res.data);
        console.log(res.data.result.length);
        setFullList(res.data.result);
        setCountryList(
          Array.from(
            new Set(res.data.result.map(({ iso_country }) => iso_country))
          )
        );
      });
    };

    // call the function
    fetchData();
  }, []);
  useEffect(() => {
    if (fromLat && fromLong && toLat && toLong) {
      setDistance(distanceFunc(fromLat, fromLong, toLat, toLong));
    }
  }, [fromLat, fromLong, toLat, toLong]);
  return (
    <div className="App">
      <header className="App-header">
        <p>Current Weather in my Country</p>
        <p>
          {degree} {weatherType} Humidity: {humidity}
        </p>
        From
        <Container>
          <Row>
            <Col>
              <DropdownButton
                id="dropdown-basic-button"
                title={fromCountry}
                onSelect={handleFromCountry}
              >
                {countryList.length > 0 &&
                  countryList.map((country, index) => {
                    return (
                      <Dropdown.Item
                        key={country + "" + index}
                        eventKey={country}
                      >
                        {country}
                      </Dropdown.Item>
                    );
                  })}
              </DropdownButton>
              {fromCountry != "Select Country" && (
                <h4>You selected {fromCountry}</h4>
              )}
            </Col>
            <Col>
              <DropdownButton
                id="dropdown-basic-button"
                title={fromAirport}
                onSelect={handleFromAirport}
              >
                {fromAirportList.length > 0 &&
                  fromAirportList.map((airport, index) => {
                    return (
                      <Dropdown.Item
                        key={airport + "" + index}
                        eventKey={airport}
                      >
                        {airport}
                      </Dropdown.Item>
                    );
                  })}
              </DropdownButton>
              {fromAirport != "Select Airport" && (
                <h4>You selected {fromAirport}</h4>
              )}
            </Col>
          </Row>
        </Container>
        To
        <Container>
          <Row>
            <Col>
              <DropdownButton
                id="dropdown-basic-button"
                title={toCountry}
                onSelect={handleToCountry}
              >
                {countryList.map(function (country) {
                  return (
                    <Dropdown.Item eventKey={country}>{country}</Dropdown.Item>
                  );
                })}
              </DropdownButton>
              {toCountry != "Select Country" && (
                <h4>You selected {toCountry}</h4>
              )}
            </Col>
            <Col>
              <DropdownButton
                id="dropdown-basic-button"
                title={toAirport}
                onSelect={handleToAirport}
              >
                {toAirportList.length > 0 &&
                  toAirportList.map((airport, index) => {
                    return (
                      <Dropdown.Item
                        key={airport + "" + index}
                        eventKey={airport}
                      >
                        {airport}
                      </Dropdown.Item>
                    );
                  })}
              </DropdownButton>
              {toAirport != "Select Airport" && (
                <h4>You selected {toAirport}</h4>
              )}
            </Col>
          </Row>
        </Container>
        {distance && <p>Total Fare {distance * 10}</p>}
        <Button
          variant="primary"
          onClick={() => {
            navigate("/paymentPage", {
              state: {
                from_airport: fromAirport,
                from_country: fromCountry,
                to_airport: toAirport,
                to_country: toCountry,
                total: Math.ceil(distance * 10),
              },
            });
          }}
        >
          Order
        </Button>
      </header>
    </div>
  );
}

export default Home;
