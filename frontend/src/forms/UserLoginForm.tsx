import { createStore } from 'solid-js/store';
import { useForm, Validator } from './validation';
import { JSX } from 'solid-js/jsx-runtime';
import { createLazyQuery, createMutation } from '@merged/solid-apollo';
import { CREATE_USER } from '../gql/mutations';
import { GET_USER, GET_USERS } from '../gql/queries';
import { createEffect, createResource, createSignal, onCleanup } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import TextInput from '../components/forms/Input';
import { User } from '../utils/types';
import { getFromLocalStorage, setToLocalStorage } from '../utils/localStorage';
import { Navigate, redirect, useNavigate } from '@solidjs/router';
import { equal } from 'assert';

interface ErrorMessageProps {
  error: string;
}

const ErrorMessage = (props: ErrorMessageProps): JSX.Element => <span class="label-text-alt place-self-start">{props.error}</span>;

const inputClasses = 'input input-bordered w-full max-w-xs';

const UserLoginForm = () => {
  const navigate = useNavigate();
  const token = getFromLocalStorage('token');
  if (token) {
    navigate('/');
  }
  const [fields, setFields] = createStore<{ email: string }>({
    email: '',
  });
  // Create a reactive signal for the variables
  const [variables, setVariables] = createSignal({ data: fields });

  // Use createEffect to watch for changes in the fields and update variables accordingly
  createEffect(() => {
    setVariables({ data: fields });
  });

  onCleanup(() => setVariables({ data: fields }));

  const [fetchUser, data] = createLazyQuery<User>(GET_USER);

  const [user] = createResource(data, (data) => data.user);

  const { validate, formSubmit, errors } = useForm();

  const fn = async (form?: HTMLFormElement): Promise<void> => {
    if (!user()) {
      await fetchUser({ variables: { email: fields.email } });
    }
    if (user()) {
      console.log('user', user());
      if (form) form.submit();
      const token = { key: 'token', value: user().email };
      setToLocalStorage(token);
    } else {
      console.log('user not found');
    }
  };

  const emailExists: Validator = async ({ value }): Promise<string | void> => {
    await fetchUser({ variables: { email: value } });
    if (!user()) {
      return `${value} does not exist`;
    }
  };

  return (
    <form class="form-control w-72 ml-2" use:formSubmit={fn}>
      <div class="label flex flex-col">
        <span class="label-text place-self-start">Email</span>
        <input
          class={twMerge(inputClasses, errors.email && 'input-bordered input-error')}
          name="email"
          type="email"
          placeholder="Email"
          autocomplete="email"
          required
          use:validate={[emailExists]}
          onInput={(e) => setFields('email', e.target.value)}
          onkeyup={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              fn();
            }
          }}
        />
        {errors.email && <ErrorMessage error={errors.email} />}
      </div>

      <button class="btn btn-primary mt-2" type="submit">
        Log in
      </button>
    </form>
  );
};

export default UserLoginForm;
