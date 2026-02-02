
const staffLeavesData = [
  {
    staffId: "STF101",
    name: "Alice Brown",
    department: "Operations",
    type: "Sick Leave",
    from: "2026-01-05",
    to: "2026-01-07",
    action: "...",
  },
  {
    staffId: "STF102",
    name: "Mark Lee",
    department: "Front Desk",
    type: "Casual Leave",
    from: "2026-01-10",
    to: "2026-01-11",
    action: "...",
  },
];

const checkFilter = (leaveType, search) => {
  return staffLeavesData.filter((row) => {
    const m1 =
      leaveType === "All Types" ||
      String(row.type).toLowerCase() === String(leaveType).toLowerCase();
    const m2 =
      !search ||
      String(row.name).toLowerCase().includes(search.toLowerCase()) ||
      String(row.staffId).toLowerCase().includes(search.toLowerCase());
    return m1 && m2;
  });
};

console.log("All Types:", checkFilter("All Types", "").length); // Should be 2
console.log("Sick Leave:", checkFilter("Sick Leave", "").length); // Should be 1
console.log("Search Alice:", checkFilter("All Types", "Alice").length); // Should be 1
console.log("Search STF102:", checkFilter("All Types", "STF102").length); // Should be 1
