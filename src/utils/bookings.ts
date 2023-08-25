export const getStringsToDates = (
  startDateString: string,
  endDateString: string,
) => [new Date(startDateString), new Date(endDateString)];

export const getAmountOfDays = (startDate: Date, endDate: Date) => {
  const timeDifference = endDate.getTime() - startDate.getTime();
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.ceil(timeDifference / millisecondsPerDay);
};

export type Tariffs = Record<string, number>;

export const calculateRentalCost = (
  startDate: Date,
  endDate: Date,
  tariffs: Tariffs,
) => {
  // Находим сколько дней длится аренда
  const days = getAmountOfDays(startDate, endDate);

  let daysLeft = days;
  let rentalCost = 0;

  const intervals = Object.keys(tariffs);
  const amountOfTariffs = intervals.length;
  for (let i = 0; i < amountOfTariffs; i++) {
    const interval = intervals[i];
    const tariff = tariffs[interval];
    const parsedInterval = interval.split('-');
    const firstDayOfInterval = Number(parsedInterval[0]);
    const lastDayOfInterval = Number(parsedInterval[1]);
    const daysInInterval = lastDayOfInterval - firstDayOfInterval + 1;

    if (daysLeft - daysInInterval < 0) return rentalCost + daysLeft * tariff;
    rentalCost += daysInInterval * tariff;
    daysLeft -= daysInInterval;
  }
  return rentalCost;
};

export const validateInterval = (startDate: Date, endDate: Date) => {
  const timeDifference = endDate.getTime() - startDate.getTime();
  if (timeDifference <= 0) {
    return 'Invalid time interval';
  }

  const days = getAmountOfDays(startDate, endDate);
  if (days > 30) {
    return `Car cant't be booked for more than 30 days`;
  }

  // Проверяем, не выпадает ли начало или конец на выходной
  if (
    startDate.getUTCDay() === 0 ||
    startDate.getUTCDay() === 6 ||
    endDate.getUTCDay() === 0 ||
    endDate.getUTCDay() === 6
  )
    return `Booking can't be started or ended during the weekend`;
  return null;
};
