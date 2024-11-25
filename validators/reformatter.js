const reformatErrors = (errors) => {
  return errors.reduce((errorsObject, error) => {
    // FieldValidationErrors are typically what will be dealt with in this app
    errorsObject[error.path] = error.msg;
    return errorsObject;
  }, {});
};

module.exports = { reformatErrors };
