import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

import { Input, InputPassword } from '@/components/ui/input';
import { TypographySmall } from '@/components/ui/typography';
import { HaveAccountOrSignUpLinkPart } from '../auth/common/have-account-or-sing-up-link';
import apiUsers from '@/api/users/api-users';
import { useUser } from '@/state/user-provider';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  email: z.string().email().min(5, {
    message: 'Email must be at least 5 characters.'
  }),
  password: z.string().min(4, {
    message: 'Password must be at least 4 characters.'
  })
});
type UserFormValue = z.infer<typeof formSchema>;

export const SignIn = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const userData = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data: UserFormValue) => {
    const { email, password } = data;

    apiUsers
      .signIn({ email, password })
      .then((response) => {
        userData.login(response);
        navigate('/');
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive'
        });
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
                  <Input placeholder="Enter email address" {...field} autoComplete="email" />
                </FormControl>
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
                  <InputPassword type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
        </div>

        <Button type="submit" variant={'default'} className="w-full ">
          <TypographySmall>Sign In with Email</TypographySmall>
        </Button>
      </form>

      <HaveAccountOrSignUpLinkPart
        haveAccountText="Don't have an account?"
        signInOrUpLink="/auth/sign-up"
        signInOrUpText="Sign Up"
      />
    </Form>
  );
};
