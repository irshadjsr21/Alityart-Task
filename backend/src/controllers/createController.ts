/**
 * This will export a helper function (createController) which will abstract
 * some functionalities of the controller.
 */

import {
  validationResult,
  ValidationError,
  ValidationChain
} from 'express-validator';
import createError from 'http-errors';
import express from 'express';

const VALIDATION_ERROR = 'Validation error.';

interface ValidationOptions {
  validators: ValidationChain[];
  errorMsg?: string;
  throwError?: boolean;
  asObject?: boolean;
}

interface ControllerOptions {
  validation: ValidationOptions;
  inputs?: Array<string>;
}

/**
 * Convert errors array to object.
 * @param {Array} errors
 */
const covertErrorToObject = (errors: ValidationError[]) => {
  const fieldErrors: { [key: string]: string } = {};
  for (const error of errors) {
    if (error.param && !fieldErrors[error.param])
      fieldErrors[error.param] = error.msg;
  }
  return fieldErrors;
};

/**
 * Extract inputs from the request object.
 *
 * It will return all the fields if `fields` parameter is not specified
 * or is empty.
 *
 * And if `fields` parameter is specified it will return the fields mentioned
 * in it.
 */
const getInputs = (req: express.Request, fields: string[]) => {
  const inputsObj: { [key: string]: string } = {};
  if (fields && fields.length > 0)
    for (const key of fields) inputsObj[key] = req.body[key];
  else for (const key of Object.keys(req.body)) inputsObj[key] = req.body[key];
  return inputsObj;
};

/**
 * It returns the validation errors.
 */
const getValidationError = (req: express.Request, asObject: boolean) => {
  const errors = validationResult(req).array();
  if (asObject) {
    return covertErrorToObject(errors);
  }
  return errors;
};

/**
 * Create a middleware for validation check with the options specified
 */
const createValidationMiddleware = ({
  errorMsg,
  throwError,
  asObject
}: {
  errorMsg: string;
  throwError: boolean;
  asObject: boolean;
}): express.RequestHandler => {
  return async function(req, res, next) {
    const errors = getValidationError(req, asObject);
    if (
      (!asObject && errors.length > 0) ||
      (asObject && Object.keys(errors).length > 0)
    ) {
      if (throwError) {
        next(createError(400, { errors, code: 400, isCustom: true }, errorMsg));
        return;
      } else res.locals.errors = errors;
    }

    next();
  };
};

/**
 * This will create a series of middleware functions to execute common tasks
 * based on the options provided.
 */
const createController = (
  controller: express.RequestHandler,
  options: ControllerOptions = {
    validation: {
      validators: [],
      errorMsg: VALIDATION_ERROR,
      throwError: false,
      asObject: false
    },
    inputs: undefined
  }
) => {
  const middlewareArray: express.RequestHandler[] = [];

  const customController: express.RequestHandler = async function(
    req,
    res,
    next
  ) {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  if (options.inputs) {
    let fields: string[] = [];
    if (Array.isArray(options.inputs)) fields = options.inputs;

    middlewareArray.push((req, res, next) => {
      const inputs = getInputs(req, fields);
      if (res.locals.inputBody) {
        res.locals.inputBody = { ...res.locals.inputBody, ...inputs };
      } else {
        res.locals.inputBody = inputs;
      }
      next();
    });
  }

  if (options.validation) {
    middlewareArray.push(...options.validation.validators);
    middlewareArray.push(
      createValidationMiddleware({
        throwError: options.validation.throwError || false,
        errorMsg: options.validation.errorMsg || VALIDATION_ERROR,
        asObject: options.validation.asObject || false
      })
    );
  }

  middlewareArray.push(customController);
  return middlewareArray;
};

export default createController;
