/* eslint-disable array-callback-return */
import React from 'react';
import PropTypes from 'prop-types';

import { Avatar } from '../Avatar';
import './avatar-group.scss';

/**
 * @description - This component displays group of Avatars
 *
 * @param {object} { classes, imgList } - classes and imgList are props
 * @return {JSX}
 */
export const AvatarGroup = ({ classes, imgList }) => (
  <div className="avatar-group">
    {imgList.map((img, index) => {
      if (index < 7) {
        return (
          <div key={`img${index}`} className={`avatar-item ${classes}`}>
            <Avatar imgUrl={img.imgUrl} />
          </div>
        );
      }
    })}
    {imgList.length > 7 && <span className="img-count">{`+${imgList.length - 7}`}</span>}
  </div>
);

AvatarGroup.propTypes = {
  classes: PropTypes.string,
  imgList: PropTypes.arrayOf(PropTypes.shape).isRequired
};

AvatarGroup.defaultProps = { classes: '' };
