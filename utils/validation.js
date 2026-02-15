const isMissFields = async (field, data, field_files = [], data_files = []) => {
  let missing = field.filter((v) => typeof data[v] === "undefined");
  const empty = field.filter((v) => typeof data[v] !== "undefined" && data[v] === "");

  const mis_file = await isExistFile(field_files, data_files);
  missing.push(...mis_file);

  const msg_mis = missing.length ? "Missing some fields [" + missing.join(",") + "]" : "";
  const msg_emp = empty.length ? "Empty some values [" + empty.join(",") + "]" : "";

  return msg_mis || msg_emp ? msg_mis + " " + msg_emp : "";
};

const isExist = async (params) => {
  return typeof params !== "undefined" && params !== "";
};

const isExistFile = async (field, data) => {
  return field.filter((field) => !data.find((item) => item.fieldname === field));
};

const isNumber = async (params) => {
  return /^[0-9]+$/.test(params);
};

module.exports = { isExist, isNumber, isMissFields };
