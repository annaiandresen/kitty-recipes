import { createStore } from 'solid-js/store';

export interface Validator {
  (element: HTMLInputElement): Promise<string | void>;
}

interface FieldConfig {
  element: HTMLInputElement;
  validators: Validator[];
}

interface Fields {
  [key: string]: FieldConfig;
}

interface FormErrors {
  [key: string]: string | undefined;
}

interface FormOptions {
  errorClass?: string;
}

export function useForm({ errorClass }: FormOptions = {}) {
  const [errors, setErrors] = createStore<FormErrors>({});
  const fields: Fields = {};

  const validate = (ref: HTMLInputElement, accessor: () => Validator[] | Validator) => {
    const accessorValue = accessor();
    const validators = Array.isArray(accessorValue) ? accessorValue : [accessorValue];
    let config: FieldConfig;
    fields[ref.name] = config = { element: ref, validators };
    ref.onblur = checkValid(config, setErrors, errorClass);
    ref.oninput = () => {
      if (!errors[ref.name]) return;
      setErrors({ [ref.name]: undefined });
    };
  };

  const formSubmit = (ref: HTMLFormElement, accessor?: () => (ref: HTMLFormElement) => void) => {
    const callback = accessor?.() || (() => {});
    ref.setAttribute('novalidate', '');
    ref.onsubmit = async (e) => {
      e.preventDefault();
      let errored = false;

      for (const k in fields) {
        const field = fields[k];
        await checkValid(field, setErrors, errorClass)();
        if (!errored && field.element.validationMessage) {
          field.element.focus();
          errored = true;
        }
      }
      !errored && callback(ref);
    };
  };

  return { validate, formSubmit, errors };
}

function checkValid(config: FieldConfig, setErrors: (errors: FormErrors) => void, errorClass?: string) {
  return async () => {
    const { element, validators } = config;
    element.setCustomValidity('');
    element.checkValidity();
    let message = element.validationMessage;

    if (!message) {
      for (const validator of validators) {
        const text = await validator(element);
        if (text) {
          element.setCustomValidity(text);
          break;
        }
      }
      message = element.validationMessage;
    }

    if (message) {
      setErrors({ [element.name]: message });
    }
  };
}
