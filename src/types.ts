/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  audio?: string;
  audioSecondary?: string[];
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | object;
}

export interface TranslationAyah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
}

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
}

export interface Reciter {
  id: string;
  name: string;
  englishName: string;
  style?: string;
}

export interface Bookmark {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
}

export interface SearchResult {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  arabicText: string;
  englishTranslation: string;
  urduTranslation: string;
}
