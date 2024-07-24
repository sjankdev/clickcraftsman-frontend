export const formatEnum = (value) => {
    if (!value) return '';
    return value
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };
  