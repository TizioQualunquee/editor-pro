export const countWords = (text) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const countChars = (text) => {
  return text ? text.length : 0;
};

export const countCharsNoSpaces = (text) => {
  return text ? text.replace(/\s/g, '').length : 0;
};

export const countLines = (text) => {
  if (!text) return 0;
  return text.split(/\r\n|\r|\n/).length;
};

export const countParagraphs = (text) => {
  if (!text) return 0;
  // A paragraph is typically separated by empty lines
  return text.split(/\n\s*\n/).filter(para => para.trim().length > 0).length;
};
