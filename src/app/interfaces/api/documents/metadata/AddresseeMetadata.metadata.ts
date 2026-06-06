interface AddresseeMetadata {
  recipientUnitId: string;
  addressedToDesignationId: string;
  isPrimary: boolean;
}

const emptyAddressee: AddresseeMetadata = {
    addressedToDesignationId: '',
    recipientUnitId: '',
    isPrimary: true
}

export { type AddresseeMetadata, emptyAddressee };
