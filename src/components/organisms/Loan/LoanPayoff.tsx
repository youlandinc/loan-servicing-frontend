import { FC } from 'react';

import { ServicingSide, StyledLayout } from '@/components/molecules';

export const LoanPayoff: FC = () => {
  return (
    <StyledLayout isHomepage={false} sideMenu={<ServicingSide />}>
      LoanPayoff
    </StyledLayout>
  );
};
