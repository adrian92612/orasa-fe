export const PREDEFINED_TEMPLATES = [
  {
    id: "standard",
    label: "Standard",
    content:
      "Reminder: Appointment on {date} @ {time} at {businessName} ({branchName}). Please arrive 15 mins early.",
  },
  {
    id: "direct",
    label: "Direct",
    content:
      "{businessName} ({branchName}) appointment: {date} {time}. Be there 15 mins before. See you soon!",
  },
  {
    id: "concise",
    label: "Concise",
    content:
      "Your visit to {businessName} - {branchName} is on {date} at {time}. Kindly arrive 15 mins early.",
  },
  {
    id: "action",
    label: "Action-First",
    content:
      "Please arrive 15 mins early for your appointment at {businessName} ({branchName}) on {date} @ {time}.",
  },
  {
    id: "minimalist",
    label: "Minimalist",
    content:
      "{businessName}: {date} {time} at {branchName}. Please be there 15 mins early. Thank you!",
  },
] as const;
