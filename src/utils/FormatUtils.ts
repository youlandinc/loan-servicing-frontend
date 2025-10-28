export const StringIsNotEmpty = (item: string | null | undefined) =>
  !!item && item?.trim() != '';

export const formatPropertyAddress = (
  // propertyDetail: IPropertyDetailType,
  address?: string | null,
  aptNumber?: string | null,
  city?: string | null,
  state?: string | null,
  postcode?: string | null,
) => {
  return [
    `${[address, aptNumber].filter(StringIsNotEmpty).join(' ')}`,
    city,
    `${[state, postcode].filter(StringIsNotEmpty).join(' ')}`,
  ]
    .filter(StringIsNotEmpty)
    .join(', ');
};
