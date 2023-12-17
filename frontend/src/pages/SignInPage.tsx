import { A } from '@solidjs/router';
import { Component } from 'solid-js';
import UserLoginForm from '../forms/UserLoginForm';

const SignInPage: Component = () => {
  return (
    <>
      <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <img class="mx-auto sm:mt-5 h-20 w-auto" src="/src/assets/cat.svg" alt="KittyCatCo" />
          <h2 class="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-white">Sign in to your account</h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:max-w-sm justify-center">
          <UserLoginForm />
          <p class="mt-10 text-center text-sm text-gray-400">
            Not a member?{' '}
            <A href="/signup" class="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">
              Sign up here.
            </A>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
