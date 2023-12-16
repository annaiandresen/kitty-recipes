import { createStore } from 'solid-js/store';
import { useForm, Validator } from './validation';
import { JSX } from 'solid-js/jsx-runtime';
import { createLazyQuery, createMutation } from '@merged/solid-apollo';
import { CREATE_USER } from '../gql/mutations';
import { GET_USER, GET_USERS } from '../gql/queries';
import { createEffect, createSignal, onCleanup } from 'solid-js';
import { twMerge } from 'tailwind-merge';

const EMAILS: string[] = ['johnsmith@outlook.com', 'mary@gmail.com', 'djacobs@move.org'];

function fetchUserName(name: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(EMAILS.indexOf(name) > -1), 200);
  });
}

interface ErrorMessageProps {
  error: string;
}

const ErrorMessage = (props: ErrorMessageProps): JSX.Element => <span class="label-text-alt place-self-start">{props.error}</span>;

const inputClasses = 'input input-bordered w-full max-w-xs';

const UserCreateForm = () => {
  //   const [variables, setVariables] = createStore<{ email: string; firstName: string; lastName: string }>({ email: '', firstName: '', lastName: '' });
  const [fields, setFields] = createStore<{ email: string; firstName: string; lastName: string }>({
    email: '',
    firstName: '',
    lastName: '',
  });
  // Create a reactive signal for the variables
  const [variables, setVariables] = createSignal({ data: fields });

  // Use createEffect to watch for changes in the fields and update variables accordingly
  createEffect(() => {
    setVariables({ data: fields });
  });

  onCleanup(() => setVariables({ data: fields }));

  const [fetchUser, userData] = createLazyQuery(GET_USER);

  const [mutate, data] = createMutation(CREATE_USER, { variables: variables(), refetchQueries: [GET_USERS] });
  const { validate, formSubmit, errors } = useForm({
    errorClass: 'error-input',
  });
  const fn = (form: HTMLFormElement): void => {
    mutate();
    form.submit();
    console.log('Created user', JSON.stringify(data()));
  };
  const emailExists: Validator = async ({ value }): Promise<string | void> => {
    const exists = await fetchUser({ variables: { email: value } });
    return exists ? `${value} is already being used` : undefined;
  };

  //   const matchesPassword: Validator = async ({ value }): Promise<string | void> => {
  //     return value === fields.password ? undefined : 'Passwords must Match';
  //   };

  return (
    <form class="form-control w-72" use:formSubmit={fn}>
      <div class="label flex flex-col">
        <span class="label-text place-self-start">Email</span>

        <input
          class={twMerge(inputClasses, errors.email && 'input-bordered input-error')}
          name="email"
          type="email"
          placeholder="Email"
          required
          use:validate={[emailExists]}
          onInput={(e) => setFields('email', e.target.value)}
        />
        {errors.email && <ErrorMessage error={errors.email} />}
      </div>
      <div class="label flex flex-col">
        <span class="label-text place-self-start">First name</span>
        <input
          class={inputClasses}
          name="first-name"
          type="text"
          placeholder="First name"
          required
          onInput={(e) => setFields('firstName', e.target.value)}
        />
      </div>
      <div class="label flex flex-col">
        <span class="label-text place-self-start">Last name</span>
        <input
          class={inputClasses}
          name="last-name"
          type="text"
          placeholder="Last name"
          required
          onInput={(e) => setFields('lastName', e.target.value)}
        />
      </div>

      <button class="btn" type="submit">
        Submit
      </button>
    </form>
  );
};

export default UserCreateForm;
