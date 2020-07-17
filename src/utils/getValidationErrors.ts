import { ValidationError } from 'yup';

//consegue criar de forma generica um objeto que irá receber qualquer nome e o valor dele deve ser sempre string
//exemplo {"ajsdhfajsd": "123" }
interface Errors {
  [key: string]: string;
}

export default function getValidationErrors(err: ValidationError): Errors {
  const validationsErrors: Errors = {};

  err.inner.forEach((error) => {
    validationsErrors[error.path] = error.message;
  });

  return validationsErrors;
}
