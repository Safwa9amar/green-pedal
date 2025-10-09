import { pricingOptions } from "@/constants/pricing";
import dayjs from "dayjs";

export function calculateRideCost(startTime: string, endTime: string) {
  const start = dayjs(startTime);
  const end = dayjs(endTime);

  const diffMinutes = end.diff(start, "minute"); // total minutes
  if (diffMinutes < 60) {
    return diffMinutes * pricingOptions[0].price;
  } else if (diffMinutes < 1440) {
    // less than a day
    const hours = diffMinutes / 60;
    return hours * pricingOptions[1].price;
  } else if (diffMinutes < 43200) {
    // less than a month (30 days)
    const days = diffMinutes / 1440;
    return days * pricingOptions[2].price;
  } else {
    const months = diffMinutes / 43200;
    return months * pricingOptions[3].price;
  }
}

/**
 * Calculates ongoing ride cost from a start time until now
 * @param startTime - ISO string (e.g. "2025-10-08T10:00:00Z")
 * @returns { cost, durationMinutes, bestUnit, formattedDuration }
 */
export function calculateOngoingRideCost(startTime: string) {
  const start = dayjs(startTime);
  const now = dayjs();

  const diffMinutes = now.diff(start, "minute");
  if (diffMinutes <= 0)
    return {
      cost: 0,
      durationMinutes: 0,
      bestUnit: "minute",
      formattedDuration: "0 min",
    };

  // determine best unit (minute, hour, day, month)
  let cost = 0;
  let bestUnit = "minute";

  if (diffMinutes < 60) {
    cost = diffMinutes * pricingOptions[0].price;
    bestUnit = "minute";
  } else if (diffMinutes < 1440) {
    const hours = diffMinutes / 60;
    cost = hours * pricingOptions[1].price;
    bestUnit = "hour";
  } else if (diffMinutes < 43200) {
    const days = diffMinutes / 1440;
    cost = days * pricingOptions[2].price;
    bestUnit = "day";
  } else {
    const months = diffMinutes / 43200;
    cost = months * pricingOptions[3].price;
    bestUnit = "month";
  }

  // formatted duration
  const formattedDuration =
    diffMinutes < 60
      ? `${diffMinutes} min`
      : diffMinutes < 1440
      ? `${(diffMinutes / 60).toFixed(1)} h`
      : diffMinutes < 43200
      ? `${(diffMinutes / 1440).toFixed(1)} days`
      : `${(diffMinutes / 43200).toFixed(1)} months`;

  return {
    cost: Math.round(cost),
    durationMinutes: diffMinutes,
    bestUnit,
    formattedDuration,
  };
}
