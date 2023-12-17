import { type Component, Suspense, createResource, For } from 'solid-js';
import { createQuery } from '@merged/solid-apollo';
import { GET_USERS } from './gql/queries';
import { Icon } from 'solid-heroicons';
import { envelope, clock } from 'solid-heroicons/solid-mini';
import { User } from './utils/types';
import { getFromLocalStorage } from './utils/localStorage';
import { useNavigate } from '@solidjs/router';

const UserComponent: Component<{ user: User }> = (props) => {
  const readableDate = new Date(props.user.createdAt).toLocaleDateString();
  return (
    <div>
      <h2>
        {props.user.firstName} {props.user.lastName}
      </h2>
      <div class="flex flex-row items-center gap-1">
        <Icon path={envelope} class="w-4 h-4" />
        <p>{props.user.email}</p>
      </div>
      <div class="flex flex-row items-center gap-1">
        <Icon path={clock} class="w-4 h-4" />
        <p>{readableDate}</p>
      </div>

      <p>{props.user.isAdmin ? '✅Admin' : '❌Not admin'}</p>
    </div>
  );
};

type UserListComponentProps = {
  users?: User[];
};

const UserListComponent: Component<UserListComponentProps> = (props) => {
  return (
    <ul>
      <For each={props.users}>{(user) => <UserComponent user={user} />}</For>
    </ul>
  );
};

const App: Component = () => {
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const token = getFromLocalStorage('token');

  if (!token) {
    navigate('/landing-page');
  }

  const data = createQuery<{ users: User[] }>(GET_USERS);
  const [users] = createResource(data, (data) => data.users);

  return (
    <div>
      <Suspense fallback={<h2>Loading users...</h2>}>
        <UserListComponent users={users()} />
      </Suspense>
      <button class="btn btn-secondary" onClick={() => logOut()}>
        Log out
      </button>
    </div>
  );
};

export default App;
