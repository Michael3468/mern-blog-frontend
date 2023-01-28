/**
 * getDayMonthYear
 * @param {Date} date
 */
export const getDayMonthYear = (date) => {
  const d = new Date(date);

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
};
