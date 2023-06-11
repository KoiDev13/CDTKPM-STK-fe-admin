import { format, getTime, formatDistanceToNow } from 'date-fns';


// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}
export function convertStringToDate(temp) {
  const year = temp.year  
  let month = temp.month
  if (month.toString().length === 1) {
    month = `0${temp.month}`
  }
  let day = temp.day
  if (day.toString().length === 1) {
    day = `0${temp.day}`
  }
  return `${year}-${month}-${day}`
}

export function convertStringToTime (temp)  {
  let hour = temp.hour;
  if (hour.toString().length === 1) {
    hour = `0${temp.hour}`
  }
  let minute = temp.minute;
  if (minute.toString().length === 1) {
   minute = `0${temp.minute}`
  }
  return `${hour}:${minute}`
}
