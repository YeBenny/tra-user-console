// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    email: string;
    id: string;
    nickname: string;
    userStatus: number;
  };

  type LoginType = 0 | 1 | 2;

  type LoginIdType = 0 | 1 | 2;

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
}
