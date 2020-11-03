const CA = require("../models/ca");
const { google } = require("googleapis");
const sheets = google.sheets("v4");
const { getAuthToken, getSpreadSheetValues } = require("../googlesheet.js");

const spreadsheetId = "1wp7EqOx9bEqNDsZdPXvSH73X3F7Z31RZTJ9DYhxFyKQ";
const sheetName = "Sheet1";
async function getRecords() {
  try {
    const details = await getSpreadSheetValues({
      spreadsheetId,
      sheetName,
      auth,
    });
    return details;
  } catch (error) {
    console.log(error);
  }
}
const registerCA = async (req, res) => {
  try {
    const { email, password, phone, name, college } = req.body;
    if (!email || !password || !phone || !name || !college) {
      return res.status(400).json({ message: "Please fill all the details" });
    }
    const ca = new CA({
      email,
      name,
      phone,
      password,
      college,
    });
    //const records = await getRecords();
    //console.log(records.data.values);
    const auth = await getAuthToken();
    const response = await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: sheetName,
      insertDataOption: "INSERT_ROWS",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[name, college, phone, email, "0","N"]],
      },
    });
    //console.log(response);
    await ca.save();
    res.status(200).json({ ca });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};
module.exports = {
  registerCA,
};
