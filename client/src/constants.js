const BASE_URL = "http://localhost:5000/";
// const BASE_URL = "https://habit-tracker-server.vercel.app/";

const SIGNUP_URL = BASE_URL + "api/user";
const ADD_HABIT_URL = BASE_URL + "api/habit";
const FETCH_USER_HABITS_URL = BASE_URL + "api/habit/";
const FETCH_MIN_START_DATE_URL = BASE_URL + "api/habit/startDate?";
const FETCH_FILTERED_HABITS_URL = BASE_URL + "api/habit/filtered?";
const FETCH_SIGNLE_HABIT_URL = BASE_URL + "api/habit/single/";
const UPDATE_USER_HABIT_URL = BASE_URL + "api/habit/";
const FETCH_MASTER_CATEGORIES_URL = BASE_URL + "api/masterHabit/categories/";
const FETCH_CATEGORY_HABITS_URL = BASE_URL + "api/masterHabit/categoryHabits/";

module.exports = {
  SIGNUP_URL,
  ADD_HABIT_URL,
  FETCH_USER_HABITS_URL,
  FETCH_MIN_START_DATE_URL,
  FETCH_FILTERED_HABITS_URL,
  FETCH_SIGNLE_HABIT_URL,
  UPDATE_USER_HABIT_URL,
  FETCH_MASTER_CATEGORIES_URL,
  FETCH_CATEGORY_HABITS_URL
};
