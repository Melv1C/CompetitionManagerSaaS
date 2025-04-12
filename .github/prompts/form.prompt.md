Use React Hook Form + Zod for handling form.

## 1. Always Define a Zod Schema for Validation  

Use **Zod** to define validation rules:  

```tsx
import { z } from "zod";

const userSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters."),
  email: z.string().email("Invalid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type UserFormData = z.infer<typeof userSchema>;
```

---

## 2. Use `useForm` with `zodResolver`  

Set up the form using **React Hook Form** and **Zod resolver**:  

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<UserFormData>({
  resolver: zodResolver(userSchema),
});
```

---

## 3. Always Use `register` for Inputs  

Connect inputs to the form using **register**:  

```tsx
<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register("username")} placeholder="Username" />
  {errors.username && <span>{errors.username.message}</span>}

  <input {...register("email")} placeholder="Email" />
  {errors.email && <span>{errors.email.message}</span>}

  <input type="password" {...register("password")} placeholder="Password" />
  {errors.password && <span>{errors.password.message}</span>}

  <button type="submit">Submit</button>
</form>
```

---

## 4. Handle Form Submission with Type Safety  

Always type the `onSubmit` function:  

```tsx
const onSubmit = (data: UserFormData) => {
  console.log("Form Data:", data);
};
```

---

## 5. Use Default Values for Controlled Inputs  

```tsx
const { reset } = useForm<UserFormData>({
  resolver: zodResolver(userSchema),
  defaultValues: { username: "", email: "", password: "" },
});
```

Call `reset()` after a successful form submission if needed.

---

## 6. Enforce Conditional Validation  

For fields that depend on other inputs:  

```tsx
const schema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string(),
}).refine((data) => data.confirmPassword === data.password, {
  message: "Passwords must match.",
  path: ["confirmPassword"],
});
```

---