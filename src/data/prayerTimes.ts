/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PrayerTimes } from "../types";

export interface CityPrayerTimes {
  city: string;
  country: string;
  times: PrayerTimes;
}

export const defaultCitiesPrayerTimes: CityPrayerTimes[] = [
  {
    city: "Makkah",
    country: "Saudi Arabia",
    times: {
      Fajr: "04:12",
      Sunrise: "05:38",
      Dhuhr: "12:22",
      Asr: "15:39",
      Sunset: "19:07",
      Maghrib: "19:07",
      Isha: "20:37",
      Imsak: "04:02",
      Midnight: "00:01"
    }
  },
  {
    city: "Karachi",
    country: "Pakistan",
    times: {
      Fajr: "04:15",
      Sunrise: "05:42",
      Dhuhr: "12:35",
      Asr: "16:01",
      Sunset: "19:24",
      Maghrib: "19:24",
      Isha: "20:53",
      Imsak: "04:05",
      Midnight: "00:04"
    }
  },
  {
    city: "London",
    country: "United Kingdom",
    times: {
      Fajr: "02:44",
      Sunrise: "04:43",
      Dhuhr: "13:08",
      Asr: "17:23",
      Sunset: "21:21",
      Maghrib: "21:21",
      Isha: "22:56",
      Imsak: "02:34",
      Midnight: "01:02"
    }
  },
  {
    city: "New York",
    country: "United States",
    times: {
      Fajr: "03:47",
      Sunrise: "05:25",
      Dhuhr: "12:59",
      Asr: "16:56",
      Sunset: "20:31",
      Maghrib: "20:31",
      Isha: "22:08",
      Imsak: "03:37",
      Midnight: "01:00"
    }
  },
  {
    city: "Jakarta",
    country: "Indonesia",
    times: {
      Fajr: "04:43",
      Sunrise: "05:59",
      Dhuhr: "12:00",
      Asr: "15:21",
      Sunset: "17:58",
      Maghrib: "17:58",
      Isha: "19:12",
      Imsak: "04:33",
      Midnight: "23:58"
    }
  }
];
