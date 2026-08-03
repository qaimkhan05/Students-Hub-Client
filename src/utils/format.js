export const formatPrice = (price) => {
  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return 'Free';
  }
  return 'Rs. ' + numericPrice;
};
