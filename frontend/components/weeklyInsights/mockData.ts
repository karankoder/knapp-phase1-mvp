export const CATEGORIES = [
  { name: "P2P Transfers", icon: "users", amount: 800, percentage: 56 },
  {
    name: "Lifestyle & Food",
    icon: "shopping-bag",
    amount: 350,
    percentage: 24,
  },
  {
    name: "Exchange & Network Fees",
    icon: "terminal",
    amount: 120,
    percentage: 8,
  },
  { name: "Others", icon: "more-horizontal", amount: 150, percentage: 12 },
];

export const TRANSACTIONS = {
  "P2P Transfers": [
    {
      id: "1",
      title: "Alex M.",
      amount: 250,
      type: "out",
      date: "Dec 17",
      time: "2:34 PM",
    },
    {
      id: "2",
      title: "Sarah K.",
      amount: 150,
      type: "out",
      date: "Dec 16",
      time: "11:20 AM",
    },
    {
      id: "3",
      title: "Mike R.",
      amount: 200,
      type: "out",
      date: "Dec 15",
      time: "6:45 PM",
    },
    {
      id: "4",
      title: "Emma L.",
      amount: 200,
      type: "out",
      date: "Dec 14",
      time: "9:12 AM",
    },
  ],
  "Lifestyle & Food": [
    {
      id: "1",
      title: "Whole Foods",
      amount: 124.5,
      type: "out",
      date: "Dec 17",
      time: "5:30 PM",
    },
    {
      id: "2",
      title: "Uber Eats",
      amount: 45.0,
      type: "out",
      date: "Dec 16",
      time: "8:15 PM",
    },
    {
      id: "3",
      title: "Starbucks",
      amount: 12.5,
      type: "out",
      date: "Dec 15",
      time: "7:45 AM",
    },
    {
      id: "4",
      title: "Target",
      amount: 168.0,
      type: "out",
      date: "Dec 14",
      time: "3:20 PM",
    },
  ],
  "Exchange & Network Fees": [
    {
      id: "1",
      title: "ETH Gas Fee",
      amount: 45.0,
      type: "out",
      date: "Dec 17",
      time: "4:12 PM",
    },
    {
      id: "2",
      title: "Exchange Fee",
      amount: 35.0,
      type: "out",
      date: "Dec 16",
      time: "10:30 AM",
    },
    {
      id: "3",
      title: "Network Fee",
      amount: 40.0,
      type: "out",
      date: "Dec 14",
      time: "2:45 PM",
    },
  ],
  Others: [
    {
      id: "1",
      title: "Subscription",
      amount: 50.0,
      type: "out",
      date: "Dec 17",
      time: "12:00 AM",
    },
    {
      id: "2",
      title: "Miscellaneous",
      amount: 75.0,
      type: "out",
      date: "Dec 15",
      time: "4:30 PM",
    },
    {
      id: "3",
      title: "ATM Withdrawal",
      amount: 25.0,
      type: "out",
      date: "Dec 13",
      time: "11:00 AM",
    },
  ],
};

export const TOTAL_OUTBOUND = CATEGORIES.reduce((acc, c) => acc + c.amount, 0);

export const CHART_DATA = [30, 45, 35, 60, 55, 70, 75];
