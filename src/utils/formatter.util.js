const LABEL_MAX_LENGTH = 40

/**
 *
 * @param {string} label The Label of the Custom Metadata Type Record
 * @returns {string} The Label of the Custom Metadata Type Record formatted with max length
 */
 const formatLabel = (label) =>{
  return label.length > LABEL_MAX_LENGTH
    ? encodeHTMLEntities(label.substring(0, LABEL_MAX_LENGTH))
    : encodeHTMLEntities(label);
}

/**
 *
 * @param {string} label The Label of the Custom Metadata Type Record
 * @returns {string} The Label of the Custom Metadata Type Record formatted with max length and all special characters removed
 */
const formatFileName = (label) => {
  label = label.length > LABEL_MAX_LENGTH ? label.substring(0, LABEL_MAX_LENGTH) : label
  label = removeHTMLEntities(label)
  label = replaceSpecialChars(label)
  label = removeUnderscoresFromEdges(label, "start")
  label = removeUnderscoresFromEdges(label, "end")
  return label;
}

/**
 *
 * @param {string} label The Label of the Custom Metadata Type Record
 * @returns {string} The Label of the Custom Metadata Type Record encoded with HTML Entities
 */
const encodeHTMLEntities = (label) => {
  return label.replace(/[\u00A0-\u9999<>\&]/g, function (i) {
    return "&#" + i.charCodeAt(0) + ";";
  });
}

/**
 *
 * @param {string} label The Label of the Custom Metadata Type Record
 * @returns {string} The Label of the Custom Metadata Type Record with HTML Entities removed
 */
const removeHTMLEntities = (label) => {
  return label.replace(/[\u00A0-\u9999<>\&]/g, "_");
}

/**
 * 
 * @param {string} label The Label of the Custom Metadata Type Record
 * @returns {string} The filename with special chars and spaces replaced by underscores
 */
const replaceSpecialChars = (label) => {
  return label
    .replaceAll(/[^a-zA-Z ]/g, "_")
    .replaceAll(" ", "_")
    .replaceAll(/_+/g, "_")
}

/**
 * 
 * @param {string} label The Label of the Custom Metadata Type Record
 * @param {('start' | 'end')} position The position where is to remove the underscore from the label
 * @returns {string} The label with underscores removed from some edge
 */
const removeUnderscoresFromEdges = (label, position) => {
  if (position === "start") {
    return label[0] === "_" 
      ? label.slice(1) 
      : label
  }

  return label[label.length - 1] === "_" 
    ? label.slice(0, -1) 
    : label
}

module.exports = {
  formatLabel,
  formatFileName,
  encodeHTMLEntities,
  removeHTMLEntities,
  replaceSpecialChars,
  removeUnderscoresFromEdges
}