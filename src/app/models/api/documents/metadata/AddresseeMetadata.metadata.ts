interface AddresseeMetadata {
  recipientUnitId: string;
  addressedToDesignationId: string | null;
  isPrimary: boolean;
}

const emptyAddressee: AddresseeMetadata = {
    addressedToDesignationId: null,
    recipientUnitId: '',
    isPrimary: true
}

export { type AddresseeMetadata, emptyAddressee };
