export const PREDEFINED_TEMPLATES = [
  {
    id: "professional",
    label: "Professional",
    content:
      "Reminder for your appointment at {businessName} ({branchName}) on {date} at {time}. Arrive 15 mins early.",
  },
  {
    id: "friendly",
    label: "Friendly",
    content:
      "Hi! Friendly reminder for your visit to {businessName} ({branchName}) on {date} at {time}. Arrive 15 mins early",
  },
  {
    id: "action",
    label: "Action-Oriented",
    content: "Please arrive 15 mins early for your appointment at {businessName} ({branchName}) on {date} at {time}.",
  },
] as const;
