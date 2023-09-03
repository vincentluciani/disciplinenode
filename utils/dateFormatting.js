const formatDate = dateObjectToFormat => {
    const formattedDate =   dateObjectToFormat.year.toString() + "-" +
                            dateObjectToFormat.month.toString().padStart(2,'0') + "-" +
                            dateObjectToFormat.day.toString().padStart(2,'0')

    return formattedDate
}


const toDateTime = dateObjectToFormat =>{
    const { year, month, day, hours, minutes, seconds, milliseconds, timeZoneOffset } = dateObjectToFormat

    // Construct a Date object using the components
    let reconstructedDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds, milliseconds))

    // Adjust the time based on the time zone offset
    const adjustedTime = reconstructedDate.getTime() + timeZoneOffset * 60 * 1000; // Convert offset to milliseconds
    reconstructedDate.setTime(adjustedTime);
    return reconstructedDate

}
module.exports = {
    formatDate,
    toDateTime
}

