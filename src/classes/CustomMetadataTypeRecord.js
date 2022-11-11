const fs = require("fs");
const path = require("path");

const formatter = require('../utils/formatter.util.js')

const CustomMetadataType = require("./CustomMetadataType.js");

class CustomMetadataTypeRecord extends CustomMetadataType {
  constructor(objectName, fields, record, fileExtension) {
    super(objectName, fields);
    this.label = formatter.formatLabel(record.label);
    this.values = record.values;
    this.content = "";
    this.fileName = formatter.formatFileName(record.label);
    this.fileExtension = fileExtension;
  }  

  /**
   * Build XML Metadata for this CustomMetadata instance
   */
  execute() {
    this.content = `<?xml version="1.0" encoding="UTF-8"?>
    <CustomMetadata xmlns="http://soap.sforce.com/2006/04/metadata" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
      <label>${this.label}</label>
      <protected>false</protected>
      ${this.fields.map((field) =>
      `<values>
        <field>${field.name}</field>
        <value ${field.type}>${formatter.encodeHTMLEntities(
            this.values[field.name]
          )}</value>
      </values>
      `).join("")}
    </CustomMetadata>`;

    this.writeFile();
  }

  /**
   * Write to file the XML content built for this CustomMetadataTypeRecord instance
   */
  writeFile() {
    fs.writeFile(path.join(__dirname, "../", "../", "customMetadata", `${this.objectName}.${this.fileName}.${this.fileExtension}`), 
    this.content, 
    (err) => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    });
  }
}

module.exports = CustomMetadataTypeRecord;
