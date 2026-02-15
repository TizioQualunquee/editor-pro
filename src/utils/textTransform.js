export const toUpperCase = (text) => text.toUpperCase();

export const toLowerCase = (text) => text.toLowerCase();

export const capitalize = (text) => {
  return text.replace(/\b\w/g, l => l.toUpperCase());
};

export const trimSpaces = (text) => {
  return text.split('\n').map(line => line.trim()).join('\n');
};

export const sortLines = (text, direction = 'asc') => {
  const lines = text.split('\n');
  if (direction === 'asc') {
    lines.sort();
  } else if (direction === 'desc') {
    lines.sort().reverse();
  }
  return lines.join('\n');
};

export const replaceText = (text, search, replace, useRegex = false) => {
  if (!search) return text;
  if (useRegex) {
    try {
      const regex = new RegExp(search, 'g');
      return text.replace(regex, replace);
    } catch (e) {
      console.error("Invalid Regex", e);
      return text;
    }
  }
  return text.split(search).join(replace);
};
