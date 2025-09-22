const formatDate = (date) =>
  date ? new Date(date).toISOString().split("T")[0] : "";

const sendExcel = async (res, workbook, fileName) => {
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
  await workbook.xlsx.write(res);
  res.status(200).end();
};

// Apply styling to header row
const styleHeader = (worksheet) => {
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1F4E78" }, // Navy blue
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  worksheet.views = [{ state: "frozen", ySplit: 1 }]; // Freeze first row
  worksheet.autoFilter = {
    from: "A1",
    to: worksheet.columns[worksheet.columns.length - 1].letter + "1",
  };
};


module.exports = {
  formatDate,
  sendExcel,
  styleHeader,
};