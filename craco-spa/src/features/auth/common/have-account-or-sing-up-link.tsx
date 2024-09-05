import { Button } from '@/components/ui/button';
import { TypographyMuted } from '@/components/ui/typography';
import { Link } from 'react-router-dom';

export const HaveAccountOrSignUpLinkPart = (props: {
  haveAccountText: string;
  signInOrUpLink: string;
  signInOrUpText: string;
}) => {
  return (
    <div className="flex items-center justify-center gap-x-3 w-full mt-7">
      <TypographyMuted className="dark:text-text_03 text-[13px] leading-4">
        {props.haveAccountText}
      </TypographyMuted>
      <Button variant={'link'} asChild>
        <Link to={props.signInOrUpLink}>{props.signInOrUpText}</Link>
      </Button>
    </div>
  );
};
