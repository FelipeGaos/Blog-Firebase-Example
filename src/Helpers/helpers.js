/**
 * Created by raul on 9/13/16.
 */

export class Helpers {
    constructor() {

    }

    /**
     * Converts a date string in a human readable format (MMM DD, YYYY)
     * @param date
     * @returns {string}
     */
    static convertDateToString = (date) => {
        var dateObj = new Date(date);
        var convertedDate = dateObj.toDateString().split(" ");
        return convertedDate[1] + " " + convertedDate[2] + ", " + convertedDate[3];
    };

    /**
     * Same as the above function but returns a longer format (MMM DD, YYYY HH:MM)
     * @param date
     * @returns {string}
     */
    static convertDateToLongString = (date) => {
        var dateObj = new Date(date);
        var convertedDate = dateObj.toString().split(" ");
        return convertedDate[1] + " " + convertedDate[2] + ", " + convertedDate[3] + " at " + convertedDate[4].substring(0, 5);
    };

    /**
     * Takes a number of arguments and checks if any of them is null, empty or undefined
     * @returns {boolean}
     */
    static hasEmptyFields = () => {
        var params = Array.prototype.slice.call(arguments);
        for (var i = 0; i < params.length; ++i) {
            if (!params[i]) {
                return true;
            }
        }
        return false;
    };

    /**
     * Extracts a summary (up to 350 characters) of the post full content
     * @param post
     * @returns {*}
     */
    static createPostSummary = (post) => {
        if (post.length < 350) {
            return post;
        }
        var summary = post.substring(0, 350);
        var index = Math.max(summary.lastIndexOf('?'), summary.lastIndexOf('!'), summary.lastIndexOf('.'));
        return summary.substring(0, index + 1);
    }
}