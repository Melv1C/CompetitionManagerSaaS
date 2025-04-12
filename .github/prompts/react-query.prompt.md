## 1. Set Up Query Client

Wrap your app with `QueryClientProvider`:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Components */}
    </QueryClientProvider>
  );
}
```

## 2. Define Query Functions Outside Components

Always separate API logic from components:

```tsx
import axios from 'axios';

const fetchUsers = async () => {
  const { data } = await axios.get('/api/users');
  return data;
};
```

## 3. Use `useQuery` for Data Fetching

Replace `useEffect` with `useQuery`:

```tsx
import { useQuery } from '@tanstack/react-query';

function UsersList() {
  const { data, error, isLoading } = useQuery(['users'], fetchUsers);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## 4. Use `useMutation` for Data Modifications

Handle mutations and invalidate queries to refresh data:

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

const addUser = async (newUser) => {
  const { data } = await axios.post('/api/users', newUser);
  return data;
};

function AddUserForm() {
  const queryClient = useQueryClient();
  const mutation = useMutation(addUser, {
    onSuccess: () => queryClient.invalidateQueries(['users']),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ name: e.target.name.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <button type="submit">Add User</button>
    </form>
  );
}
```

## 5. Optimize Query Keys

Use unique keys to manage caching:

```tsx
const { data } = useQuery(['user', userId], () => fetchUserById(userId));
```

## 6. Invalidate Queries on Data Change

Ensure UI updates after a mutation:

```tsx
queryClient.invalidateQueries(['users']);
```

## 7. Avoid Request Waterfalls

Use `enabled` to control dependent queries:

```tsx
const { data: user } = useQuery(['user', userId], () => fetchUser(userId));
const { data: posts } = useQuery(['posts', userId], () => fetchPostsByUser(userId), {
  enabled: !!userId,
});
```