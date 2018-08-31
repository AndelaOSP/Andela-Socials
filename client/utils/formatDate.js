import dateFns from 'date-fns';

const formatDate = (dateValue, formatType = 'dddd, MMMM Do YYYY') => dateFns.format(dateValue, formatType);

export default formatDate;
