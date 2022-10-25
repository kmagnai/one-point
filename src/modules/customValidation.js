import * as Yup from 'yup';

Yup.addMethod(Yup.string, "creditCardLength", function (errorMessage) {
  return this.test(`test-card-length`, errorMessage, function (value) {
    const { path, createError } = this;

    return (
      (value && value.length === 16) ||
      createError({ path, message: errorMessage })
    );
  });
});

export default Yup
