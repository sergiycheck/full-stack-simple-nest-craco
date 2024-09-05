import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input, InputPassword } from '@/components/ui/input';

import apiUsers from '@/api/users/api-users';
import { useToast } from '@/hooks/use-toast';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { HaveAccountOrSignUpLinkPart } from '../auth/common/have-account-or-sing-up-link';
import { useUser } from '@/state/user-provider';

const formSchema = z
  .object({
    email: z.string().email().min(5, { message: 'Email must be at least 5 characters.' }),
    password: z.string().min(4, { message: 'Password must be at least 4 characters.' }),
    repeatPassword: z.string().min(4, { message: 'Repeat password must be at least 4 characters.' })
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Passwords do not match.',
    path: ['repeatPassword']
  });

type UserFormValue = z.infer<typeof formSchema>;

export function SignUp() {
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      repeatPassword: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const userData = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data: UserFormValue) => {
    const { email, password, repeatPassword } = data;

    setIsSubmitting(true);

    apiUsers
      .signUp({
        email,
        password,
        repeatPassword
      })
      .then((response) => {
        userData.login(response);
        navigate('/');
      })
      .catch((err) =>
        toast({
          title: 'Error',
          description: err,
          variant: 'destructive'
        })
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col  w-full gap-y-4 sm:min-w-80"
      >
        <div className="flex flex-col gap-y-4 w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter email address"
                    {...field}
                    type="email"
                    autoComplete="email"
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <InputPassword
                    type="password"
                    {...field}
                    placeholder="Password"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="repeatPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repeat Password</FormLabel>
                <FormControl>
                  <InputPassword
                    type="password"
                    {...field}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button isPending={isSubmitting} type="submit" variant={'default'} className="w-full">
          Sign up with Email
        </Button>
      </form>
      <HaveAccountOrSignUpLinkPart
        haveAccountText="Already have account?"
        signInOrUpLink="/auth/sign-in"
        signInOrUpText="Sign In"
      />
    </Form>
  );
}
