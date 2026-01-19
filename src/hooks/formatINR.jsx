export const formatINR = (amount) => {
  if (!amount) return "₹ 0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2, // change to 0 if you don't want decimals
  }).format(amount);
};