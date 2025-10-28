import { FC, useCallback, useEffect, useState } from 'react';
import { Autocomplete, Box, Grid, Stack, Typography } from '@mui/material';
import { LocationOnOutlined } from '@mui/icons-material';
import parse from 'autosuggest-highlight/parse';

import { observer } from 'mobx-react-lite';

import {
  PlaceType,
  StyledAutoCompleteProps,
  StyledGoogleAutoCompleteProps,
  StyledGoogleAutoCompleteStyles,
} from './index';

import { POSTypeOf } from '@/utils';
import { useBreakpoints, useGooglePlacesSearch } from '@/hooks';
import { OPTIONS_COMMON_STATE } from '@/constant';

import {
  StyledSelect,
  StyledTextFieldInput as StyledTextField,
} from '@/components/atoms';

export const StyledGoogleAutoComplete = observer<StyledGoogleAutoCompleteProps>(
  ({
    address,
    fullAddress = true,
    disabled,
    label,
    stateError,
    addressError,
  }) => {
    const { formatAddress } = address;

    const [stateValidate, setStateValidate] = useState(stateError);

    const [addressErrorValidate, setAddressErrorValidate] = useState<
      Record<string, string[]> | undefined
    >();

    useEffect(() => {
      setAddressErrorValidate(addressError);
    }, [addressError]);

    const handledPlaceSelect = useCallback(
      (place: any) => {
        if (!place.formatted_address) {
          return;
        }

        stateValidate && setStateValidate(false);

        const addressComponents = place.address_components || [];
        const geometry = place.geometry?.location;

        const componentMap: { [key: string]: string } = {};

        addressComponents.forEach((component: any) => {
          const { types, long_name, short_name } = component;
          if (!types || types.length === 0) {
            return;
          }

          componentMap[types[0]] = long_name;

          switch (types[0]) {
            case 'administrative_area_level_1':
              if (addressErrorValidate?.state) {
                setAddressErrorValidate((prev) => {
                  if (!prev) {
                    return prev;
                  }
                  const newState = { ...prev };
                  delete newState.state;
                  return Object.keys(newState).length > 0
                    ? newState
                    : undefined;
                });
              }
              address.changeFieldValue('state', short_name);
              break;
            case 'route':
              address.changeFieldValue('street', long_name);
              break;
            case 'postal_code':
              if (addressErrorValidate?.postcode) {
                setAddressErrorValidate((prev) => {
                  if (!prev) {
                    return prev;
                  }
                  const newState = { ...prev };
                  delete newState.postcode;
                  return Object.keys(newState).length > 0
                    ? newState
                    : undefined;
                });
              }
              address.changeFieldValue('postcode', long_name);
              break;
          }
        });

        if (geometry) {
          address.changeFieldValue('lat', geometry.lat());
          address.changeFieldValue('lng', geometry.lng());
        }

        const cityFields = [
          'locality',
          'neighborhood',
          'administrative_area_level_2',
        ];
        for (const field of cityFields) {
          if (componentMap[field]) {
            if (addressErrorValidate?.city) {
              setAddressErrorValidate((prev) => {
                if (prev) {
                  delete prev.city;
                }
                return prev;
              });
            }
            address.changeFieldValue('city', componentMap[field]);
            break;
          }
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [stateValidate, addressErrorValidate],
    );

    return (
      <Stack width={'100%'}>
        {fullAddress ? (
          <Stack width={'100%'}>
            <Stack width={'100%'}>
              <StyledAutoComplete
                disabled={disabled}
                fullAddress={fullAddress}
                handledPlaceSelect={handledPlaceSelect}
                inputValue={formatAddress}
                label={label}
                onInputChange={(e, val) => {
                  if (addressErrorValidate?.address) {
                    setAddressErrorValidate((prev) => {
                      if (!prev) {
                        return prev;
                      }
                      const newState = { ...prev };
                      delete newState.address;
                      return Object.keys(newState).length > 0
                        ? newState
                        : undefined;
                    });
                  }
                  if (!val) {
                    address.reset();
                    return;
                  }
                  address.changeFieldValue('formatAddress', val);
                }}
                validate={addressErrorValidate?.address}
                value={formatAddress}
              />
            </Stack>
            <Stack
              alignItems={'flex-start'}
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              justifyContent={'flex-start'}
              mt={3}
              width={'100%'}
            >
              <StyledTextField
                disabled={disabled}
                label={'City'}
                onChange={(e) => {
                  if (addressErrorValidate?.city) {
                    setAddressErrorValidate((prev) => {
                      if (!prev) {
                        return prev;
                      }
                      const { city, ...rest } = prev;
                      return Object.keys(rest).length > 0 ? rest : undefined;
                    });
                  }
                  address.changeFieldValue('city', e.target.value);
                }}
                placeholder={'City'}
                sx={{ flex: 1 }}
                // validate={addressErrorValidate?.city}
                value={address.city}
              />
              <StyledSelect
                disabled={disabled}
                label={'State'}
                onChange={(e) => {
                  if (addressErrorValidate?.state) {
                    setAddressErrorValidate((prev) => {
                      if (!prev) {
                        return undefined;
                      }
                      const { state: _removed, ...rest } = prev;
                      return Object.keys(rest).length > 0 ? rest : undefined;
                    });
                  }
                  address.changeFieldValue('state', e.target.value as string);
                }}
                options={OPTIONS_COMMON_STATE}
                sx={{ flex: 1 }}
                validate={stateError ? [' '] : addressErrorValidate?.state}
                value={address.state}
              />
            </Stack>
            <Stack
              alignItems={'flex-start'}
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              justifyContent={'flex-start'}
              mt={3}
              width={'100%'}
            >
              <StyledTextField
                disabled={disabled}
                label={'Apt/Unit'}
                onChange={(e) =>
                  address.changeFieldValue('aptNumber', e.target.value)
                }
                placeholder={'Apt/Unit'}
                sx={{ flex: 1 }}
                value={address.aptNumber}
              />
              <StyledTextField
                disabled={disabled}
                label={'Zip code'}
                onChange={(e) => {
                  if (addressErrorValidate?.postcode) {
                    setAddressErrorValidate((prev) => {
                      if (!prev) {
                        return prev;
                      }
                      const newState = { ...prev };
                      delete newState.postcode;
                      return Object.keys(newState).length > 0
                        ? newState
                        : undefined;
                    });
                  }
                  address.changeFieldValue('postcode', e.target.value);
                }}
                placeholder={'Zip code'}
                sx={{ flex: 1 }}
                // validate={addressErrorValidate?.postcode}
                value={address.postcode}
              />
            </Stack>
          </Stack>
        ) : (
          <Stack>
            <StyledAutoComplete
              disabled={disabled}
              fullAddress={fullAddress}
              handledPlaceSelect={handledPlaceSelect}
              inputValue={formatAddress}
              onInputChange={(e, val) =>
                address.changeFieldValue('formatAddress', val)
              }
              value={formatAddress}
            />
          </Stack>
        )}
      </Stack>
    );
  },
);

const StyledAutoComplete: FC<StyledAutoCompleteProps> = ({
  inputValue,
  onInputChange,
  fullAddress,
  handledPlaceSelect,
  value,
  disabled,
  label,
  validate,
  ...rest
}) => {
  const breakpoints = useBreakpoints();

  const [selfValue, setSelfValue] = useState<PlaceType | null | string>(value);

  const { options, loading, getPlaceDetailsRequest, serviceLoaded } =
    useGooglePlacesSearch(inputValue, fullAddress);

  // Don't show options when disabled
  const filteredOptions = disabled ? [] : options;

  return (
    <Autocomplete
      disabled={disabled}
      id="youland-google-map-autoComplete"
      sx={StyledGoogleAutoCompleteStyles.inside.autoComplete}
      {...rest}
      autoSelect={false}
      clearOnBlur={false}
      filterOptions={(options) => (disabled ? [] : options)}
      filterSelectedOptions
      freeSolo
      getOptionLabel={(option) => {
        return typeof option === 'string'
          ? option
          : fullAddress
            ? option.structured_formatting.main_text
            : option.description;
      }}
      includeInputInList
      inputValue={inputValue}
      loading={loading}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onChange={async (event: any, newValue: PlaceType | null) => {
        setSelfValue(newValue);
        if (newValue?.place_id && fullAddress && serviceLoaded && !disabled) {
          getPlaceDetailsRequest(
            {
              placeId: newValue.place_id,
              fields: [
                'address_components',
                'geometry.location',
                'place_id',
                'formatted_address',
              ],
            },
            (place) => handledPlaceSelect(place),
          );
        }
      }}
      onInputChange={onInputChange}
      options={filteredOptions}
      renderInput={(params) => (
        <StyledTextField
          {...params}
          fullWidth
          label={label || 'Street address'}
          placeholder="Address"
          // validate={validate}
          // size={['xs', 'sm', 'md'].includes(breakpoints) ? 'small' : 'medium'}
        />
      )}
      renderOption={(props, option) => {
        if (POSTypeOf(option) === 'String') {
          return;
        }
        const matches =
          option.structured_formatting.main_text_matched_substrings || [];
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match: any) => [
            match.offset,
            match.offset + match.length,
          ]),
        );

        return (
          <li {...props} key={props.id}>
            <Grid alignItems="center" container>
              <Grid item sx={{ display: 'flex', width: 44 }}>
                <LocationOnOutlined sx={{ color: 'text.secondary' }} />
              </Grid>
              <Grid item sx={StyledGoogleAutoCompleteStyles.inside.icon}>
                {parts.map((part, index) => (
                  <Box
                    component="span"
                    key={index}
                    sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                  >
                    {part.text}
                  </Box>
                ))}
                <Typography color="text.secondary" variant="body2">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
      selectOnFocus={false}
      value={selfValue}
    />
  );
};
