import { Link } from '@inertiajs/react';
import { Button } from '@mui/material';
import React from 'react';

interface Props {
  href: string;
  children: React.ReactNode;
  color?:
    | 'primary'
    | 'inherit'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
  isNextPage?: boolean;
}

const AnchorComponent = React.forwardRef<HTMLAnchorElement, any>(
  (props, ref) => <a {...props} ref={ref} />,
);

export default function MuiInertiaLinkButton({
  href,
  children,
  color,
  isNextPage,
}: Props) {
  return (
    <Button
      type="button"
      variant="contained"
      size="large"
      color={color ?? 'primary'}
      target={isNextPage ? '_blank' : 'same-page'}
      LinkComponent={isNextPage ? AnchorComponent : Link}
      href={href}
      sx={{ marginY: 'auto' }}
    >
      {children}
    </Button>
  );
}
