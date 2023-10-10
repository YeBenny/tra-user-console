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
}
