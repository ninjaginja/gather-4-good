import React, {Component} from "react";
import { Grid, Row, Col } from 'react-bootstrap';
import EventForm from "../../components/EventForm"
import moment from "moment";
import StateList from "./States";
import API from "../../utils/API.js";
import axios from "axios";

class CreateEvent extends Component {

  state = {
    date: moment(),
    time: moment(),
    focused: false,
    causeType: "",
    causeId: "",
    eventName: "",
    imgUrl: "",
    eventDescription: "",
    locationName: "",
    streetAddress: "",
    city: "",
    USstate: "",
    zipcode: "",
    causes: []
  };


  loadCauses = () => {
    API.getCauses()
      .then(res => {
        console.log("Results returned when requesting causes")
        console.log(res.data);
        this.setState({causes: res.data});
      })
      .catch(err => console.log(err))
  }


  componentDidMount = () => {
    this.loadCauses();
  }


  handleInputChange = (event) =>  {
    const { name, value } = event.target;
    let cause_id;
    console.log(name);
    console.log(value);

    this.setState({[name]: value}, () => {
      console.log("Update Value State");
      console.log(this.state.causeType);
    });

    if(name === "causeType") {
      const option = event.target.options[event.target.selectedIndex];
      const causeId = option.attributes.getNamedItem("data-cause-id").value;

      this.setState({causeId: causeId}, () => {
        console.log("Update CauseId State:");
        console.log(this.state.causeId);
      });
    }
  }


  handleDateChange = (date) => {
    console.log(date._d);

    this.setState({date}, () => {
      console.log(this.state.date);
    });
  }


  handleDateFocusChange = ({focused}) =>  {
    console.log(focused);

    this.setState({focused: focused}, () => {
      console.log(this.state.focused);
    });
  }


  handleTimeChange = (value) => {
    console.log(value && value.format('h:mm a'));

    this.setState({time: value}, () => {
      console.log("Time state:");
      console.log(this.state.time);
    });
  }


  createDateTimeStr = () => {
    const dateStr = this.state.date._d.toDateString();
    const timeStr = this.state.time._d.toTimeString();
    console.log(typeof this.state.date._d)
    const new_date = `${dateStr} ${timeStr}`;
    console.log(new_date);
    const log_date = new Date(new_date);
    console.log(log_date);
    const ISO_DATE_TIME = new Date(new_date).toISOString();
    console.log("dateStr: " + dateStr);
    console.log("timeStr: " + timeStr);
    console.log(ISO_DATE_TIME);

    //Following three lines of function are only for testing purposes
    //To confirm the ISO date is being properly generated
    const mom_date = moment(ISO_DATE_TIME);
    const formattedDate = mom_date.format("ddd, DD MMM YYYY h:mm:ss a");
    console.log(formattedDate);

    //Return value
    return ISO_DATE_TIME;
  }


  handleFormSubmit = (event) =>  {

    event.preventDefault();

    const ISO_DATE_TIME = this.createDateTimeStr();
    const {eventName, eventDescription, imgUrl, locationName} = {...this.state};
    const {streetAddress, city, USstate, zipcode, causeId} = {...this.state};

    // console.log("DATE ON FORM SUBMIT");
    // console.log(ISO_DATE_TIME);
    // console.log(eventName);
    // console.log(eventDescription);
    // console.log(imgUrl);
    // console.log(locationName);
    // console.log(streetAddress);
    // console.log(city);
    // console.log(USstate);
    // console.log(zipcode);
    // console.log(causeId);

    // date: moment(),
    // time: moment(),
    // focused: false,
    // causeType: "",
    // eventName: "",
    // imgUrl: "",
    // eventDescription: "",
    // streetAddress: "",
    // city: "",
    // USstate: "",
    // zipcode: "",
    // causes: []

    const eventData = {
      title: eventName,
      dateTime: ISO_DATE_TIME,
      description: eventDescription,
      img_url: imgUrl,
      location_name: locationName,
      location_street: streetAddress,
      location_city: city,
      location_state: USstate,
      location_zip: zipcode,
      cause: causeId
    }

    console.log(eventData);

    API.createEvent(eventData)
      .then(res => {
        console.log("Result returned when generating new event")
        console.log(res);
      })
      .catch(err => console.log(err))
  }


  render() {
      return (
        <Grid>
          <Row>
            <Col xs={12}>
              <EventForm {...this.state}
                stateList={StateList}
                handleFormSubmit={this.handleFormSubmit}
                handleInputChange={this.handleInputChange}
                handleDateChange={this.handleDateChange}
                handleDateFocusChange={this.handleDateFocusChange}
                handleTimeChange={this.handleTimeChange} />
            </Col>
          </Row>
        </Grid>
    );
  }
}

export default CreateEvent;