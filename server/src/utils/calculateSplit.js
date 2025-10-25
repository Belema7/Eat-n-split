export const calculateSplit = (amount, participants) => {
  if (!participants || participants.length === 0) return [];
  const share = amount / participants.length;
  return participants.map((user) => ({
    user,
    share: parseFloat(share.toFixed(2)),
  }));
};
