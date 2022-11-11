const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse')

const CustomMetadataTypeRecord = require('./classes/CustomMetadataTypeRecord.js');

/**
 * validate --object-name flag from command execution
 */
const objectNameRaw = process.argv.find(
  element => element.includes('--object-name=')
)
if (!objectNameRaw || objectNameRaw.split('--object-name=')[1].length < 1) throw new Error('Passing --object-name=Object_Name is required')
const objectName = objectNameRaw.split('--object-name=')[1]

/**
 * validate --data flag from command execution
 */
const importCSVPathRaw = process.argv.find(
  element => element.includes('--data=')
)
if (!importCSVPathRaw || importCSVPathRaw.split('--data=')[1].length < 1) throw new Error('Passing --data=path/to/CSV_filename.csv is required')
const importCSVPath = importCSVPathRaw.split('--data=')[1]

/**
 * validate --file-extension flag from command execution
 */
 const fileExtensionRaw = process.argv.find(
  element => element.includes('--file-extension=')
)
if (!fileExtensionRaw || fileExtensionRaw.split('--file-extension=')[1].length < 1) throw new Error('Passing --file-extension=md-meta.xml or --file-extension=md is required')
const fileExtension = fileExtensionRaw.split('--file-extension=')[1]

const data = new Array()

/**
 * read CSV data
 */
fs.createReadStream(path.join(__dirname, importCSVPath))
  .pipe(parse({ delimiter: ";", encoding: 'utf-8' }))
  .on("data", function (row) {
    data.push(row)
  })
  .on("end", function () {
    execute()
  })

/**
 * process all data
 */
function execute() {
  const fields = new Array()
  const records = new Array()

  const FIELDS_COLUMN_START_INDEX = 1
  const RECORD_ROW_START_INDEX = 2
  const RECORDS_COLUMN_START_INDEX = 1
  const ROWS_LENGTH = data.length
  const COLUMNS_LENGTH = data[0].length

  for (let column = FIELDS_COLUMN_START_INDEX; column < COLUMNS_LENGTH; column++) {
    fields.push({
      name: data[0][column],
      type: data[1][column]
    })
  }

  for (let row = RECORD_ROW_START_INDEX; row < ROWS_LENGTH; row++) {
    let values = {}
    for (let column = RECORDS_COLUMN_START_INDEX; column < COLUMNS_LENGTH; column++) {
      values[[fields[(column-1)].name]] = data[row][(column)]
    }
    records.push({
      label: data[row][0],
      values
    })
  }

  for (const record of records) {
    const customMetadataTypeRecord = new CustomMetadataTypeRecord(
      objectName, 
      fields, 
      record,
      fileExtension
    )
    customMetadataTypeRecord.execute()
  }
}
