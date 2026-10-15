import leetcodeIcon from "../icons/leetcode.png";
import hackerrankIcon from "../icons/hackerrank.png";
import gfgIcon from "../icons/gfg.png";
import type { CodingAchievement } from "./types";

export const codingAchievementsData: CodingAchievement[] = [
  {
    id: 1,
    platform: "LeetCode",
    count: 20,
    label: "Problems Solved",
    icon: leetcodeIcon,
    link: "https://leetcode.com/u/PranitBhangale/"
  },
  {
    id: 2,
    platform: "HackerRank",
    count: 15,
    label: "Problems Solved",
    icon: hackerrankIcon,
    link: "https://www.hackerrank.com/profile/pranitbhangale14"
  },
  {
    id: 3,
    platform: "GeeksforGeeks",
    count: 12,
    label: "Problems Solved",
    icon: gfgIcon,
    link: "https://www.geeksforgeeks.org/user/pranitbhangale14/"
  }
];
