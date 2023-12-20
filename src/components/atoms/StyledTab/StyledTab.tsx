import React, {
  FC,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useState,
} from 'react';
import { Box, Stack, SxProps, Tab, Tabs } from '@mui/material';

type TabPanelProps = {
  index: number;
  value: number;
  sx?: SxProps;
};

type StyledTabProps = {
  tabsData: {
    label: string;
    content: ReactNode;
  }[];
  sx?: SxProps;
};

export const StyledTab: FC<StyledTabProps> = (props) => {
  const { tabsData, sx } = props;

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const TabPanel = useCallback((props: PropsWithChildren<TabPanelProps>) => {
    const { children, value, index, ...other } = props;

    return (
      <Box hidden={value !== index} {...other}>
        {value === index && children}
      </Box>
    );
  }, []);

  return (
    <Stack sx={{ height: '100%' }}>
      <Tabs
        onChange={handleChange}
        sx={{
          '& .MuiTab-root': {
            textTransform: 'none',
            p: 1.25,
            color: 'text.hover',
          },
          '& .MuiTabs-flexContainer .MuiButtonBase-root': {
            p: 0,
            minWidth: 0,
            minHeight: 0,
            mr: 5,
            mb: 1.25,
            fontSize: 14,
            fontWeight: 600,
          },
          '& .MuiTab-root.Mui-selected': {
            color: 'text.primary',
          },
          mb: 3,
          minHeight: 0,
          ...sx,
        }}
        value={value}
      >
        {tabsData.map((item, index) => (
          <Tab disableRipple key={index} label={item.label} />
        ))}
      </Tabs>
      {tabsData.map((item, index) => (
        <TabPanel index={index} key={index} sx={{ flex: 1 }} value={value}>
          {item.content}
        </TabPanel>
      ))}
    </Stack>
  );
};
