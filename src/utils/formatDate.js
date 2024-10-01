const moment = require('moment');

function formatDate(dateString) {
    const date = new Date(dateString);

    // var now = moment(new Date()); //todays date
    // var end = moment('2024-03-30'); // another date
    // var duration = moment.duration(now.diff(end));
    // var days = Math.floor(duration.asMonths());

    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

module.exports = formatDate;
