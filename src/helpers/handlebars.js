const formatDate = require('../utils/formatDate');

const helpers = {
    json: function (context) {
        return JSON.stringify(context);
    },
    sum: (a, b) => a + b,
    formatDate: (dateString) => formatDate(dateString),
    ifEquals: function (arg1, arg2, options) {
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    },
    op: function (v1, operator, v2, ...options) {
        switch (operator) {
            case '+':
                return v1 + v2;
            case '-':
                return v1 - v2;
            case '==':
                return v1 == v2 ? options[0] : options[1];
            case '===':
                return v1 === v2 ? options[0] : options[1];
            case '!=':
                return v1 != v2 ? options[0] : options[1];
            case '!==':
                return v1 !== v2 ? options[0] : options[1];
            case '<':
                return v1 < v2 ? options[0] : options[1];
            case '<=':
                return v1 <= v2 ? options[0] : options[1];
            case '>':
                return v1 > v2 ? options[0] : options[1];
            case '>=':
                return v1 >= v2 ? options[0] : options[1];
            case '&&':
                return v1 && v2;
            case '||':
                return v1 || v2;
            default:
                return options.inverse(this);
        }
    },
    times: function (n, block) {
        var accum = '';
        for (var i = 0; i < n; ++i) {
            block.data.index = i;
            block.data.first = i === 0;
            block.data.last = i === n - 1;
            accum += block.fn(this);
        }
        return accum;
    },
};

module.exports = helpers;
