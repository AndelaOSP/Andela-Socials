import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import InterestCard from '../../components/cards/InterestCard';
import interests from '../../fixtures/interests';
import { withRouter } from 'react-router-dom';
import { ModalContextCreator } from '../../components/Modals/ModalContext';

//actions
import { getCalendarUrl } from '../../actions/graphql/interestGQLActions';
import { createInterests, removeInterests, getUserInterests } from '../../actions/graphql/interestGQLActions'
import { bindActionCreators } from 'redux';


/**
 * @description allows users to select their interests
 *
 * @class Interests
 * @extends {React.Component}
 */
class Interests extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  state = {
    interests: [],
    unjoinedInterests: [],
    joinInterests: []
  }

  /**
   * React Lifecycle hook
   *
   * @memberof Interests
   * @returns {null}
   */
  async componentDidMount() {
    const { interests, getUserInterests } = this.props;
    await getUserInterests();
    const myInterests = interests.interests.joinedCategories;
    this.setState({
      interests: myInterests.map(interest => interest.followerCategory)
    });

  }

  /**
   * @description Select a particular interest on click
   * 
   * @memberof Interests
   */
  handleClick = (category, cancel = false) => {

    if (cancel) {
      const myInterest = this.props.interests.interests.joinedCategories.map(interest => interest.followerCategory.id);
      const myInterestList = new Set(myInterest);

      return this.setState((prevState) => {
        const { interests, joinInterests } = prevState;
        const interest = interests.findIndex(interest => interest.id === category.node.id);
        const unjoinedInterest = interests.splice(interest, 1);

        const joinInterest = joinInterests.findIndex(interest => interest.id === category.node.id);
        joinInterests.splice(joinInterest, 1);

        return {
          interests,
          unjoinedInterests: myInterestList.has(unjoinedInterest[0].id) ? [...prevState.unjoinedInterests, unjoinedInterest[0]] : prevState.unjoinedInterests,
          joinInterests
        }

      })
    }

    this.setState((prevState) => ({
      interests: [...prevState.interests, category.node],
      joinInterests: [...prevState.joinInterests, category.node]
    }));
  }

  /**
   * @description For creating and removing interests after interests selection 
   *
   * @memberof Interests
   */
  createInterests = () => {

    const { unjoinedInterests, joinInterests } = this.state;
    const interestsToAdd = joinInterests.map(i => i.id);
    const interestsToRemove = unjoinedInterests.map(i => i.id);
    if (joinInterests.length > 0) {
      this.props.createInterests(interestsToAdd)
    }
    if (unjoinedInterests.length > 0) {
      this.props.removeInterests(interestsToRemove);
    }
  }

  queryCalendarUrl = () => {
    this.props.getCalendarUrl()
      .then(authUrl => {
        if (authUrl) {
          window.location.href = authUrl
        }
      });
  }

  redirectToHomePage = (closeModal) => {
    closeModal();
    this.props.history.push('/events');
  }

  showAuthenticateModal = () => (
    <ModalContextCreator.Consumer>
      {({
        activeModal, openModal, closeModal
      }) => {
        if (activeModal) return null;
        return (
          <Fragment>
            <button
              onClick={() => this.redirectToHomePage(closeModal)}
              className="interests__btn interests__btn-cancel"
              type="button"
            >{this.state.interests.length > 0 ? 'Skip' : 'Cancel'}</button>
            <button
              type="button"
              className="interests__btn interests__btn-submit"
              onClick={() => {
                this.createInterests()
                openModal('SUBMIT_INVITE', {
                  modalHeadline: 'Authenticate Calendar',
                  formText: `Authenticate Andela socials to have access to your Andela calendar`,
                  formId: 'submit-event-form',
                  submitForm: this.queryCalendarUrl,
                  cancel: () => this.redirectToHomePage(closeModal),
                })
              }
              }
            >
              {this.state.interests.length > 0 ? 'Update' : 'Next'}
            </button>
          </Fragment>
        );
      }}
    </ModalContextCreator.Consumer>
  );


  render() {
    const { categoryList } = this.props;
  
    return (
      <div className="interests-page">
        <h2 className="interests-page__header">Choose activities that interest you.</h2>
        <p className="interests-page__subheader">Select and deselect interests below.</p>
        <div className="interests">
          {
            categoryList && categoryList.map((category) => {
              const { node: { name, id } } = category;

              return <InterestCard
                key={id}
                category={category}
                name={name}
                handleClick={this.handleClick}
                active={!!this.state.interests.find(interest => interest.id == id)}
              />
            })
          }
        </div>
        <footer>
          {this.showAuthenticateModal()}
        </footer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  categoryList: state.socialClubs.socialClubs || [],
  interests: state.interests,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getUserInterests,
    createInterests,
    removeInterests,
    getCalendarUrl
  },
  dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Interests));
