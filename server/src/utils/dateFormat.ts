const dateFormat = ({ date, hasHour }: { date: Date; hasHour: Boolean }) => {
  let dateOptions: object = { month: 'short', day: '2-digit', year: 'numeric' };

  if (hasHour)
    dateOptions = {
      ...dateOptions,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

  return date.toLocaleString('en-US', dateOptions).replace(',', '');
};

export default dateFormat;
