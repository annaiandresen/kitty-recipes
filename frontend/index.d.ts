import { Validator } from "./src/forms/validation";

export * from "solid-js";

declare module "solid-js" {
    namespace JSX {
      interface Directives {
        validate: Validator[];
        formSubmit: (form: HTMLFormElement) => void;
      }
    }
  }