import {addDays, addSeconds, differenceInCalendarDays, format} from "date-fns";

const slotSize = 15 * 60;

export default function parse(data) {
  return data.map(({startDate,endDate,startTime,endTime,employeeName,...rest}) => {

    const breaks = [];
    let i = 1;
    while ('startBreak'+(i===1?'':i) in rest) {
      breaks.push({
        start:rest['startBreak'+(i===1?'':i)],
        end:rest['endBreak'+(i===1?'':i)],
      });
      i++;
    }

    const daysCount = differenceInCalendarDays(addDays(new Date(endDate), 1), new Date(startDate));
    const days = new Array(daysCount).fill(null).map((u, i) => i);
    return days.map(dayIndex => {
      const dayStart = addSeconds(new Date(startDate+' '+startTime), dayIndex * 86400);
      const dayEnd = addSeconds(new Date(startDate+' '+endTime), dayIndex * 86400);
      const slots = [];
      const slotStart = new Date(dayStart);
      while (addSeconds(slotStart,slotSize) <= dayEnd) {
        const slotStartTime = format(slotStart, 'HH:mm:ss');
        const slotEndTime = format(addSeconds(slotStart,slotSize), 'HH:mm:ss');
        const collidingBreak = breaks.find(({start,end}) => start >= slotStartTime && start < slotEndTime);
        if (collidingBreak) {
          const endTime = collidingBreak.end.split(':');
          slotStart.setHours(endTime[0])
          slotStart.setMinutes(endTime[1])

          continue;
        }
        slots.push( format( slotStart, 'yyyy-MM-dd HH:mm') + ' ' + employeeName );
        slotStart.setSeconds(slotStart.getSeconds() + slotSize);
      }
      return slots;
    }).flat()
  }).flat().sort()
}