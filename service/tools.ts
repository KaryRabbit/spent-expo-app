export const lightenHexColor = (hex, percent) => {
  let num = parseInt(hex?.replace('#', ''), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = ((num >> 8) & 0x00ff) + amt,
    G = (num & 0x0000ff) + amt;

  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? R : 255) * 0x10000 +
      (B < 255 ? B : 255) * 0x100 +
      (G < 255 ? G : 255)
    )
      .toString(16)
      .slice(1)
  );
};
