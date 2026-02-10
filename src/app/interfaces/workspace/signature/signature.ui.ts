interface SignaturePlaceholderForBaseLevelAuthority {
  format: string;
}

interface SignaturePlaceHolderForBaseLevelAuthorityUi extends SignaturePlaceholderForBaseLevelAuthority {
  id: string;
}

interface SignaturePlaceHolderForHighLevelAuthorityUi extends SignaturePlaceHolderForBaseLevelAuthorityUi {
  createdBy: string;
  modifiedBy?: string;
}

export type {
  SignaturePlaceHolderForBaseLevelAuthorityUi,
  SignaturePlaceHolderForHighLevelAuthorityUi,
};

// TODO: create a metadata field for every important interface and obscure it from base level authority folks, that is, base level staff even network data is inspected should not see the placeholder metadata fields (createdBy, modifiedBy) - i think i just achieved the sam e goal by splitting the interface into base and high level authority
