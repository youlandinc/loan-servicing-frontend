import React, { FC, useEffect, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { Stack, Switch, Typography } from '@mui/material';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { observer } from 'mobx-react-lite';
import { enqueueSnackbar } from 'notistack';

import {
  StyledButton,
  StyledDialog,
  StyledDialogProps,
} from '@/components/atoms';

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { ColumnConfig } from '@/types/pipeline';

// import { _setLosPipelineColumns } from '@/request';
import { useMst } from '@/models/Root';

type ColumnItem = /*GridColDef &*/ ColumnConfig;

type ChangeOrderOfColumnsDialogProps = StyledDialogProps & {
  columns: ColumnItem[];
  callback?: (param: ColumnItem[]) => void;
  url?: string;
};

// a little function to help us with reordering the result
const reorder = (list: ColumnItem[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const ColumnsOrderDialog: FC<ChangeOrderOfColumnsDialogProps> = observer(
  ({ open, onClose, columns, callback, url, ...rest }) => {
    const { userSetting } = useMst();
    const [items, setItems] = useState(columns);

    const onDragEnd = (result: DropResult) => {
      // dropped outside the list
      if (!result.destination) {
        return;
      }

      const items2 = reorder(
        items,
        result.source.index,
        result.destination.index,
      );

      setItems(items2);
    };

    const onSwitch = (source: ColumnItem, checked: boolean) => {
      // dropped outside the list
      const result = items.map((item) =>
        item.field === source.field
          ? {
              ...source,
              visibility: checked,
            }
          : item,
      );
      setItems(result);
    };

    /*    const [state, setLosPipelineColumns] = useAsyncFn(async () => {
      const result = items.map((item, index) => {
        return {
          field: item.field,
          headerName: item.headerName,
          id: item.id,
          visibility: item.visibility,
          sort: index,
        };
      });

      const res = await _setLosPipelineColumns(result, url).catch(
        ({ message, variant, header }) => {
          enqueueSnackbar(message, {
            variant,
            isSimple: !header,
            header,
          });
        },
      );
      await userSetting.fetchUserSetting();
      callback?.(res?.data ?? []);
    }, [items, url]);*/

    useEffect(() => {
      setItems(columns);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <StyledDialog
        content={
          <>
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              pb={1.25}
              pt={3}
            >
              <Typography variant={'body2'}>
                Columns (drag to reorder)
              </Typography>
              <Typography variant={'body2'}>Toggle visibility</Typography>
            </Stack>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <Stack
                    {...provided.droppableProps}
                    border={'1px solid'}
                    borderColor={'rgba(145, 158, 171, 0.24)'}
                    borderRadius={2}
                    flex={1}
                    ref={provided.innerRef}
                    sx={{ overflowY: 'auto' }}
                  >
                    {items.map((item, index) => (
                      <Draggable
                        draggableId={item.field}
                        index={index}
                        key={item.field}
                      >
                        {(provided, snapshot) => (
                          <Stack
                            bgcolor={snapshot.isDragging ? '#EDEFF2' : 'none'}
                            borderRadius={snapshot.isDragging ? 2 : 0}
                            direction={'row'}
                            justifyContent={'space-between'}
                            p={1}
                            ref={provided.innerRef}
                            spacing={3}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              ...provided.draggableProps.style,
                              '&:hover': {
                                bgcolor: 'rgba(145, 158, 171, 0.08)',
                              },
                              display: item.hidden === true ? 'none' : 'flex',
                              userSelect: 'none',
                              // some basic styles to make the items look a bit nicer
                              // change background colour if dragging
                              // styles we need to apply on draggables
                            }}
                          >
                            <Stack
                              alignItems={'center'}
                              direction={'row'}
                              spacing={3}
                            >
                              <DragIndicatorIcon
                                sx={{ fontSize: 24, color: 'info.main' }}
                              />
                              <Typography variant={'body2'}>
                                {item.headerName}
                              </Typography>
                            </Stack>
                            <Switch
                              checked={item.visibility}
                              disabled={item.disabled}
                              onChange={(e) => {
                                onSwitch(item, e.target.checked);
                              }}
                            />
                          </Stack>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Stack>
                )}
              </Droppable>
            </DragDropContext>
          </>
        }
        footer={
          <Stack direction={'row'} gap={1.5} pt={3}>
            <StyledButton
              color="info"
              onClick={() => {
                onClose?.({}, 'backdropClick');
              }}
              size={'small'}
              variant="outlined"
            >
              Close
            </StyledButton>
            <StyledButton
              color="primary"
              size={'small'}
              // loading={state.loading}
              // onClick={setLosPipelineColumns}
              variant={'contained'}
            >
              Save
            </StyledButton>
          </Stack>
        }
        header={'Edit columns'}
        onClose={onClose}
        open={open}
        sx={{
          '& .MuiPaper-root': {
            minWidth: 800,
            width: 800,
            height: 'auto',
          },
        }}
        {...rest}
      ></StyledDialog>
    );
  },
);
