import React from 'react';
import { connect } from 'react-redux';
import InterestCard from '../../components/cards/InterestCard';
import interests from '../../fixtures/interests';

/**
 * @description allows users to select their interests
 *
 * @class Interests
 * @extends {React.Component}
 */
class Interests extends React.Component {
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
          <button
            className="interests__btn interests__btn-submit"
          >Submit</button>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, {})(Interests);
