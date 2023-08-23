export function formatTimestampMs(time: number) {
  const date = new Date(time);

  // Hours part from the timestamp
  const hours = date.getUTCHours();
  // Minutes part from the timestamp
  const minutes = '0' + date.getUTCMinutes();
  // Seconds part from the timestamp
  const seconds = '0' + date.getUTCSeconds();

  // Will display time in 10:30:23 format
  const formattedTime =
    hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

  return formattedTime;
}
