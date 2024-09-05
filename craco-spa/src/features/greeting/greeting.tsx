import { Card } from '@/components/ui/card';
import { TypographyH1, TypographyMuted } from '@/components/ui/typography';
import { useUser } from '@/state/user-provider';

export const Greeting = () => {
  const userData = useUser();

  return (
    <Card className="p-8">
      <TypographyH1>Welcome!</TypographyH1>
      <TypographyMuted>{userData?.user?.email}</TypographyMuted>
    </Card>
  );
};
