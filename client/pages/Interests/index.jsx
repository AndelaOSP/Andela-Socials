import React from 'react';
import { connect } from 'react-redux';
import InterestCard from '../../components/cards/InterestCard';
import interests from '../../fixtures/interests';
import { withRouter } from 'react-router-dom';
import { ModalContextCreator } from '../../components/Modals/ModalContext';

//actions
import { getCalendarUrl } from '../../actions/graphql/interestGQLActions';

/**
 * @description allows users to select their interests
 *
 * @class Interests
 * @extends {React.Component}
 */
class Interests extends React.Component {
  constructor(props, context){
    super(props, context);
  }
  state = {
    interests,
  }

  /**
   * React Lifecycle hook
   *
   * @memberof Interests
   * @returns {null}
   */
  componentDidMount() {
    // get interests when component mounts
  }


  handleClick = (index, isSelected = true) => {
    const interests = Object.assign(this.state.interests);
    interests[index].isSelected = isSelected;
    this.setState({
      interests,
    });
  }

  queryCalendarUrl = () => {
    this.props.getCalendarUrl()
     .then(authUrl => {
       if(authUrl){
        window.location.href = authUrl
       }
      });
  }

  redirectToHomePage = (closeModal) => {
    closeModal();
    this.props.history.push('/dashboard');
  }

  showAuthenticateModal = () => (
    <ModalContextCreator.Consumer>
      {({
        activeModal, openModal, closeModal
      }) => {
        if (activeModal) return null;
        return (
          <button
            type="button"
            className="interests__btn interests__btn-submit"
            onClick={() => openModal('SUBMIT_INVITE', {
              modalHeadline: 'Authenticate Calendar',
              formText: `Authenticate Andela socials to have access to your Andela calendar`,
              formId: 'submit-event-form',
              submitForm: this.queryCalendarUrl,
              cancel: () => this.redirectToHomePage(closeModal),
            })
            }
          >
            Submit
          </button>
        );
      }}
    </ModalContextCreator.Consumer>
  );
  
  render() {
    const { interests } = this.state;

    return (
      <div className="interests-page">
        <h2 className="interests-page__header">Choose activities that interest you.</h2>
        <p className="interests-page__subheader">Select and deselect interests below.</p>
        <div className="interests">
          {
            interests.map(({name, isSelected}, index) => {
              return <InterestCard
                key={index}
                index={index}
                name={name}
                active={isSelected}
                handleClick={this.handleClick} />
            })
          }
        </div>
        <footer>
          <button
            className="interests__btn interests__btn-cancel"
            type="button"
          >Cancel</button>
          {this.showAuthenticateModal()}
        </footer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, {
  getCalendarUrl
})(withRouter(Interests));
