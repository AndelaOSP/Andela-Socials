import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getEventsList, getEvent, createEvent, updateEvent, deactivateEvent } from '../../actions/graphql/eventGQLActions';
import { getInterestsList, getInterest } from '../../actions/graphql/interestGQLActions';
import { getCategoryList, getCategory, joinedClubsGQL, joinSocialClub, unjoinSocialClub  } from '../../actions/graphql/categoryGQLActions';
import { getAllEventsAttendees, getEventAttendees, getSubscribedEvents, attendEvent, unAttendEvent } from '../../actions/graphql/attendGQLActions';
import { signOut } from '../../actions/userActions';

class TestActions extends Component {

  componentDidMount() {
    this.props.getEventsList('', '', 100, 100);
    this.props.getInterestsList('', '', 100, 100);
    this.props.joinedClubsGQL();
    this.props.getCategoryList('', '', 100, 100, '', '', '', '', '');
    this.props.getAllEventsAttendees('', '', 100, 100);
    this.props.getSubscribedEvents();
  }

  getEvent = (e) => {
    e.preventDefault();
    this.props.getEvent('RXZlbnROb2RlOjE2NQ==');
  }

  createEvent = (e) => {
    e.preventDefault();
    this.props.createEvent('test_event', 'test_description', 'not.exist', 'test_venue', '02-08-2018', '12:00', 'Q2F0ZWdvcnlOb2RlOjE=');
  }

  updateEvent = (e) => {
    e.preventDefault();
    this.props.updateEvent('RXZlbnROb2RlOjE2NQ==', 'Dance Session', 'This is a dance session', 'http://not.found', 'Roof Top', '02-08-2018', '12:00pm WAT', 'Q2F0ZWdvcnlOb2RlOjE=');
  }

  deactivateEvent = (e) => {
    e.preventDefault();
    this.props.deactivateEvent('RXZlbnROb2RlOjE2OQ==');
  }

  getInterest = (e) => {
    e.preventDefault();
    this.props.getInterest('SW50ZXJlc3ROb2RlOjE=');
  }

  getCategory = (e) => {
    e.preventDefault();
    this.props.getCategory('Q2F0ZWdvcnlOb2RlOjI=');
  }

  joinClub = (e) => {
    e.preventDefault();
    this.props.joinSocialClub('Q2F0ZWdvcnlOb2RlOjU=');
  }

  unjoinClub = (e) => {
    e.preventDefault();
    this.props.unjoinSocialClub('Q2F0ZWdvcnlOb2RlOjU=');
  }

  getEventAttendees = (e) => {
    e.preventDefault();
    this.props.getEventAttendees("QXR0ZW5kTm9kZTo3MQ==");
  }

  attendEvent = (e) => {
    e.preventDefault();
    this.props.attendEvent("RXZlbnROb2RlOjE3Mg==");
  }

  unattendEvent = (e) => {
    e.preventDefault();
    this.props.unAttendEvent("RXZlbnROb2RlOjE3Mg==");
  }

  signOut = (e) => {
    e.preventDefault();
    this.props.signOut();
  }

  render() {
    return (
      <div>
        <br/><br/><br/><br/>
        <button type="button" onClick={e => this.getEvent(e)}>GET EVENT</button><br/><br/>
        <button type="button" onClick={e => this.createEvent(e)}>CREATE EVENT</button><br/><br/>
        <button type="button" onClick={e => this.updateEvent(e)}>UPDATE EVENT</button><br/><br/>
        <button type="button" onClick={e => this.deactivateEvent(e)}>DEACTIVATE EVENT</button><br/><br/>
        <button type="button" onClick={e => this.getInterest(e)}>GET INTEREST</button><br/><br/>
        <button type="button" onClick={e => this.getCategory(e)}>GET CATEGORY</button><br/><br/>
        <button type="button" onClick={e => this.joinClub(e)}>JOIN CLUB</button><br/><br/>
        <button type="button" onClick={e => this.unjoinClub(e)}>UNJOIN CLUB</button><br/><br/>
        <button type="button" onClick={e => this.getEventAttendees(e)}>GET EVENT ATTENDEES</button><br/><br/>
        <button type="button" onClick={e => this.attendEvent(e)}>ATTEND</button><br/><br/>
        <button type="button" onClick={e => this.unattendEvent(e)}>UNATTEND</button><br/><br/>
        <button type="button" onClick={e => this.signOut(e)}>SIGNOUT</button><br/><br/>
      </div>
    );
  }
}

export default connect(
  null,
  {
    getEventsList,
    getEvent,
    createEvent,
    updateEvent,
    deactivateEvent,
    getInterestsList,
    getInterest,
    joinedClubsGQL,
    joinSocialClub,
    unjoinSocialClub,
    getCategoryList,
    getCategory,
    getAllEventsAttendees,
    getEventAttendees,
    getSubscribedEvents,
    attendEvent,
    unAttendEvent,
    signOut,
  }
)(TestActions);
