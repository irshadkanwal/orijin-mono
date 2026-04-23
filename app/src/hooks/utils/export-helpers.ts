import * as XLSX from "xlsx";

export const exportTableToExcel = (
  headers: string[],
  rows: any[],
  fileNamePrefix: string,
  skipSelectColumn = true
) => {
  let filteredHeaders = headers;
  let filteredRows = rows;

  if (skipSelectColumn) {
    filteredHeaders = headers.filter((header) => header !== "select");
    filteredRows = rows.map((row) => {
      const filteredRow = row.slice(1); // remove the column for "select"
      return filteredRow;
    });
  }

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet([filteredHeaders, ...filteredRows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  const formattedDate = new Date().toISOString().slice(0, 10); // for filename

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `${fileNamePrefix}-${formattedDate}.xlsx`);

  document.body.appendChild(link);

  link.click();

  // Remove the link after download
  document.body.removeChild(link);
};

export const downloadGeoJsonFile = (geoJson: any, fileNamePrefix: string) => {
  const blob = new Blob([JSON.stringify(geoJson, null, 2)], {
    type: "application/json",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  const formattedDate = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.setAttribute("download", `${fileNamePrefix}-${formattedDate}.json`);

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
};
