// @ts-ignore
/* eslint-disable */

declare namespace API {
  type UserStatusUnknown = 0;
  type UserStatusActive = 1;
  type UserStatusInActive = 2;
  type UserStatus = UserStatusUnknown | UserStatusActive | UserStatusInActive;

  type LoginTypeUnknown = 0;
  type LoginTypePassword = 1;
  type LoginTypeSSO = 2;
  type LoginType = LoginTypeUnknown | LoginTypePassword | LoginTypeSSO;

  type LoginIdTypeUnknown = 0;
  type LoginIdTypeEmail = 1;
  type LoginIdTypeWecomId = 2;
  type LoginIdType = LoginIdTypeUnknown | LoginIdTypeEmail | LoginIdTypeWecomId;

  type TemplateTypeUnknown = 0;
  type TemplateTypeEvent = 1;
  type TemplateTypeSignMethod = 2;
  type TemplateType = TemplateTypeUnknown | TemplateTypeEvent | TemplateTypeSignMethod;

  type TemplateSubTypeUnknown = 0;
  type TemplateSubType = TemplateSubTypeUnknown;

  type TemplateStatusUnknown = 0;
  type TemplateStatusActive = 1;
  type TemplateStatusType = TemplateStatusUnknown | TemplateStatusActive;

  type CurrentUser = {
    email: string;
    id: string;
    nickname: string;
    userStatus: UserStatus;
    permissionList?: string[];
    organization?: Organization;
  };

  type Organization = {
    id: string;
    name: string;
    description: string;
    inmeritsSceneId: string;
    version: number;
    createdAt: string;
    updatedAt: number;
  };

  type ResponseResult<T> = {
    errorCode: number;
    errorMessage: string;
    data: T;
  };

  type LoginParams = {
    loginId: string;
    loginPassword?: string;
    loginType: LoginType;
    loginIdType: LoginIdType;
  };

  type GetApplicationParams = {
    id: string;
  };

  type CreateApplicationParams = {
    name: string;
    description: string;
  };

  type UpdateApplicationParams = {
    id: string;
    name?: string;
    description?: string;
    status?: number;
    version: number;
    updateFields: string[];
  };

  type GetApplicationSecretParams = {
    appId: string;
  };

  type PageInfoParams = {
    startIndex?: number;
    pageSize?: number;
    totalRows?: number;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type TemplatePageParams = {
    current?: number;
    pageSize?: number;
    type?: number;
  };

  type TraPageParams = {
    current?: number;
    pageSize?: number;
    seriesId?: string;
  };

  type RedemptionReportPageParams = {
    current?: number;
    pageSize?: number;
    seriesId?: string;
  };

  type ApplicationListItem = {
    id: string;
    name: string;
    description: string;
    status: number;
    version: number;
    updatedAt: number;
    createdAt: number;
  };

  type ApplicationList = {
    result: ApplicationListItem[];
    pageInfo: PageInfoParams;
  };

  type RedemptionReportListItem = {
    id: string;
    upstreamUserId: string;
    redemptionRuleId: string;
    title: string;
    status: string;
    updatedAt: number | string;
    createdAt: number | string;
  };

  type RedemptionReportList = {
    result: RedemptionReportListItem[];
    pageInfo: PageInfoParams;
  };

  type GetSeriesParams = {
    id: string;
  };

  type GetTraParams = {
    id: string;
  };

  type GetRedemptionListParams = {
    seriesId: string;
  };

  type DownloadReportParams = {
    seriesId: string;
  };

  type CreateSeriesParams = {
    appId: string;
    title: string;
    description: string;
    image: string;
    startUnixTime: number;
    endUnixTime: number;
    status: number;
  };

  type UpdateSeriesParams = {
    id: string;
    appId: string;
    title: string;
    description: string;
    image: string;
    startUnixTime: number;
    endUnixTime: number;
    status: number;
    version: number;
    updateFields: string[];
  };

  type SeriesListItem = {
    id: string;
    appId: string;
    createdBy: string;
    title: string;
    description: string;
    image: string;
    startUnixTime: number;
    endUnixTime: number;
    status: number;
    seriesState: number;
    nodePath: string;
    version: number;
  };

  type SeriesList = {
    result: SeriesListItem[];
    pageInfo: PageInfoParams;
  };

  type ActivityCandidateListItem = {
    id: string;
    name: string;
    description: string;
    logo: string;
    sceneId: string;
  };

  type GetContractCandidateListParams = {
    inmeritsNodePath: string;
  };

  type ContractCandidateListItem = {
    id: string;
    name: string;
    address: string;
    assetType: string;
    contractType: string;
    blockchainId: string;
    blockchainType: string;
    issueRules?: InssueRule[];
  };

  type InssueRule = {
    assetAmount: number;
    customMetadata: boolean;
    dynamicAmount: boolean;
    issueRuleEnable: boolean;
    issueRuleIssueLimit: number;
    issueRuleName: string;
    materialList: Material[];
    materialVisible: boolean;
    amount: number;
    issueFuncName: string;
    isCombineIssue: boolean;
    enableIssueNumber: number;
    finalIssueNumber: number;
    enableIssue: boolean;
  };

  type Material = {
    name: string;
    source: string;
    fileType: string;
    fileFormat: string;
    category: string;
    type: string;
    amount: number;
    writeOff: boolean;
    destroy: boolean;
    style: string;
    factor: number;
    mode: string;
    value: number;
    contentType: string;
    content: string;
    parentAssetId: string;
    id: string;
    combinationType: string;
    writeOffValue: number;
  };

  type CreateTrasParams = {
    seriesNodePath: string;
    seriesVersion: number;
    tras: CreateTrasListItem[];
  };

  type CreateTrasListItem = {
    seriesId: string;
    title: string;
    description: string;
    image: string;
    contractAddress: string;
    issueRuleId: string;
  };

  type UpdateTrasParams = {
    items: UpdateTrasListItem[];
  };

  type UpdateTrasListItem = {
    tra: {
      id: string;
      title: string;
      description: string;
      image: string;
      version: number;
    };
    updateFields: string[];
  };

  type CreateRedemptionRuleParams = {
    items: CreateRedemptionRuleItem[];
  };

  type CreateRedemptionRuleItem = {
    redemptionRule: CreateRedemptionRule;
    redemptionTraInfos: CreateRedemptionTraInfoItem[];
  };

  type CreateRedemptionRule = {
    seriesId: string;
    title: string;
    description: string;
    image: string;
  };

  type CreateRedemptionTraInfoItem = {
    traId: string;
    quantity: number;
  };

  type UpdateRedemptionRuleParams = {
    items: UpdateRedemptionRuleItem[];
  };

  type UpdateRedemptionRuleItem = {
    redemptionRule: UpdateRedemptionRule;
    redemptionTraInfos: UpdateRedemptionTraInfoItem[];
  };

  type UpdateRedemptionRule = {
    id: string;
    seriesId: string;
    title: string;
    description: string;
    image: string;
    version: number;
  };

  type UpdateRedemptionTraInfoItem = {
    id: string;
    redemptionId: string;
    traId: string;
    quantity: number;
    version: number;
  };

  type Filter = {
    name: string;
    operator: string;
    value: string;
    valueType: string;
  };

  type TraListItem = {
    id: string;
    seriesId: string;
    title: string;
    description: string;
    image: string;
    contractAddress: string;
    issueRuleId: string;
    combineRuleId: string;
    version: number;
    updatedAt: number;
    createdAt: number;
  };

  type TraList = {
    result: TraListItem[];
    pageInfo: PageInfoParams;
  };

  type RedemptionInfoTraListItem = {
    id: string;
    title: string;
    description: string;
    image: string;
    quantity: number;
  };

  type RedemptionListItem = {
    redemptionRule: RedemptionRule;
    redemptionTraInfos: RedemptionTraInfo[];
  };

  type RedemptionRule = {
    id: string;
    seriesId: string;
    title: string;
    description: string;
    image: string;
    version: number;
    updatedAt: number;
    createdAt: number;
  };

  type RedemptionTraInfo = {
    id: string;
    redemptionId: string;
    traId: string;
    quantity: number;
    version: number;
    createdAt: number;
    updatedAt: number;
  };

  type TemplateList = {
    result: TemplateListItem[];
    pageInfo: PageInfoParams;
  };

  type TemplateListItem = {
    id: string;
    title: string;
    description: string;
    image: string;
    content: string;
    status: TemplateStatusType;
    type: TemplateType;
    subType: TemplateSubType;
    version: number;
    updatedAt: number;
    createdAt: number;
  };

  type TemplateInstance = {
    templateId: string;
    templateContent: string;
    templateType: TemplateType;
    templateSubType: TemplateSubType;
  };

  type FieldListItem = {
    title: string;
    description: string;
    type: string;
    key: string;
    children?: FieldListItem[];
  };
}
