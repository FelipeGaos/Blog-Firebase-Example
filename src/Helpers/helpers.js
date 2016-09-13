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
    }
}