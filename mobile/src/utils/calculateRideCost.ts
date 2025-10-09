import dayjs from "dayjs";

const pricingOptions = [
  { unit: "minute", price: 2 },
  { unit: "hour", price: 120 },
  { unit: "day", price: 400 },
  { unit: "month", price: 3500 },
];

/**
 * Calculates ongoing ride cost from a start time until now
 * @param startTime - ISO string (e.g. "2025-10-08T10:00:00Z")
 * @returns { cost, durationMinutes, bestUnit, formattedDuration }
 */
export function calculateOngoingRideCost(startTime: string, nowArg?: Date) {
  const start = dayjs(startTime);
  // Accept an optional date for 'now' to allow testing/calculated updates
  const now = nowArg ? dayjs(nowArg) : dayjs();
  let diffMinutes = Math.abs(now.diff(start, "minute"));

  if (diffMinutes <= 0) {
    return {
      cost: 0,
      durationMinutes: 0,
      bestUnit: "minute",
      formattedDuration: "0 min",
    };
  }

  let cost = 0;
  let bestUnit = "minute";
  let formattedDuration = "";

  switch (true) {
    case diffMinutes < 60: {
      // Less than 1 hour
      cost = diffMinutes * pricingOptions[0].price;
      bestUnit = "minute";
      formattedDuration = `${diffMinutes} min`;
      break;
    }

    case diffMinutes < 1440: {
      // Less than 1 day
      const hours = now.diff(start, "hour", true);
      cost = hours * pricingOptions[1].price;
      bestUnit = "hour";
      formattedDuration = `${hours.toFixed(1)} h`;
      break;
    }

    case diffMinutes < 43200: {
      // Less than 1 month
      const days = now.diff(start, "day", true);
      cost = days * pricingOptions[2].price;
      bestUnit = "day";
      formattedDuration = `${days.toFixed(1)} days`;
      break;
    }

    default: {
      // 1 month or more
      const months = Math.abs(now.diff(start, "month", true));
      cost = months * pricingOptions[3].price;
      bestUnit = "month";
      formattedDuration = `${months.toFixed(1)} months`;
      break;
    }
  }

  return {
    cost: Math.round(cost),
    durationMinutes: diffMinutes,
    bestUnit,
    formattedDuration,
  };
}
