import { A } from '@solidjs/router';
import { Component } from 'solid-js';

const Hero: Component = () => {
  return (
    <div class="hero min-h-screen bg-base-200">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">Hello there</h1>
          <p class="py-6">Please login or sign up to continue using our site. We hope you enjoy your stay and find what you are looking.</p>
          <A href="/app">
            <button class="btn btn-primary">Create user</button>
          </A>
        </div>
      </div>
    </div>
  );
};

export default Hero;
