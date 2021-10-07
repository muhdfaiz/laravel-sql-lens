import type { ErrorObject } from "@vuelidate/core";

/**
 * Helper to display vuelidate error.
 *
 * @param errors
 * @returns string
 */
export const displayVuelidateError = (errors: ErrorObject[]): string => {
  if (errors.length > 0) {
    return errors[0]?.$message as string;
  }

  return "";
};
