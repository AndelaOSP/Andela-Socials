import React from 'react';
import { TransitionGroup, Transition } from 'react-transition-group';
import BellIcon from '../../assets/icons/BellIcon';
import DropDown from './DropDown';
import Notifier from './Notifier';
import Notifications from '../fixtures/notifications';

const NotificationCenter = () => (
  <DropDown className="notification-container">
    <button
      type="button"
      className="btn btn-default navbar-right notification-container__button"
      aria-label="Left Align"
    >
      {BellIcon}
    </button>
    <TransitionGroup component="null">
      <Transition timeout={0} appear>
        {status => (
          <div
            className={`notifications-${status} dropdown-container notification-container__list-notifications`}
          >
            {Notifications.map(notification => (
              <Notifier notification={notification} key={notification.id} />
            ))}
          </div>
        )}
      </Transition>
    </TransitionGroup>
  </DropDown>
);

export default NotificationCenter;
