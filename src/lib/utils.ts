import { formatDistance } from "date-fns";
import { hr } from "date-fns/locale";

export function getDistanceTo(date: Date, now = new Date()): string {
  return formatDistance(date, now, {
    addSuffix: true,
    locale: {
      ...hr,
      formatDistance: (token, count, options) => {
        const result = hr.formatDistance(token, count, options);
        return result.replace("oko ", "").trim();
      },
    },
  });
}
