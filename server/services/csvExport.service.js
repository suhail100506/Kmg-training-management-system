/**
 * Converts report data into CSV format, prepending UTF-8 BOM.
 */
const generateCSV = (data) => {
  if (!data || data.length === 0) {
    return '\ufeff'; // Empty CSV with UTF-8 BOM
  }

  const headers = Object.keys(data[0]);
  
  // Create CSV header row
  const headerRow = headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',');
  const rows = [headerRow];

  // Map rows
  data.forEach(item => {
    const rowValues = headers.map(header => {
      let val = item[header];
      if (val === null || val === undefined) {
        val = '';
      }
      
      let valStr = String(val);
      // Escape double quotes and wrap in double quotes if commas or quotes exist
      if (valStr.includes(',') || valStr.includes('"') || valStr.includes('\n') || valStr.includes('\r')) {
        valStr = `"${valStr.replace(/"/g, '""')}"`;
      }
      return valStr;
    });
    rows.push(rowValues.join(','));
  });

  // Combine rows and prepend UTF-8 BOM (Byte Order Mark) for Excel compatibility
  return '\ufeff' + rows.join('\n');
};

module.exports = {
  generateCSV
};
