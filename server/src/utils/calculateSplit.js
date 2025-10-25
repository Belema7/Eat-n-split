export const calculateSplit = (amount, membersInvolved, splitType = 'equal', customSplits = []) => {
  if (!membersInvolved || !Array.isArray(membersInvolved) || membersInvolved.length === 0) {
    throw new Error('Members involved must be a non-empty array');
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Amount must be a positive number');
  }
  if (!['equal', 'custom'].includes(splitType)) {
    throw new Error('Split type must be "equal" or "custom"');
  }

  try {
    if (splitType === 'equal') {
      const share = amount / membersInvolved.length;
      return membersInvolved.map((userId) => ({
        user: userId,
        amount: Number(share.toFixed(2)),
      }));
    } else if (splitType === 'custom') {
      if (!Array.isArray(customSplits) || customSplits.length !== membersInvolved.length) {
        throw new Error('Custom splits must be an array matching the number of members involved');
      }
      const totalSplit = customSplits.reduce((sum, split) => sum + (split.amount || 0), 0);
      if (Math.abs(totalSplit - amount) > 0.01) {
        throw new Error('Custom split amounts must equal the total expense amount');
      }
      return customSplits.map((split) => ({
        user: split.userId,
        amount: Number(split.amount.toFixed(2)),
      }));
    }
  } catch (error) {
    console.error('❌ Split Calculation Error:', error.message);
    throw new Error(`Failed to calculate splits: ${error.message}`);
  }
};