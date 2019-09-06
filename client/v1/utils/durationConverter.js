
import moment from 'moment-timezone';

/**
 * This function creates a time duration to fit users timezone.
 * @param {startDate, endDate, timezone}
 * @returns {string || object}
 */
const durationConverter = (startDate, endDate, timezone, separator = ' - ') => {
  const duration = moment.tz(startDate, timezone || moment.tz.guess()).format('llll')
        + separator
        + moment.tz(endDate, moment.tz.guess()).format('h:mm a z');

  return duration;
};


export default durationConverter;
