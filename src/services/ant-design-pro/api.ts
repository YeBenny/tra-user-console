// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /users */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/users', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 登录接口 POST /users/sign-in */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.ResponseResult<string>>('/users/sign-in', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取应用程序列表 POST /app/list */
export async function getAppList(params: API.PageParams, options?: { [key: string]: any }) {
  const current = params.current ?? 1;
  const pageSize = params.pageSize ?? 10;
  const body = {
    pageInfo: {
      startIndex: (current - 1) * pageSize + 1,
      pageSize: pageSize,
    },
  };
  const msg = await request<API.ResponseResult<API.ApplicationList>>('/apps/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
  const data = msg.data;
  const result = data.result;
  result?.forEach((item) => {
    item.createdAt = Math.max(0, item.createdAt ?? 0) * 1000;
    item.updatedAt = Math.max(0, item.updatedAt ?? 0) * 1000;
  });
  return {
    data: result,
    total: data.pageInfo?.totalRows,
    success: true,
    pageSize: pageSize,
    current: current,
  };
}

/** 获取应用程序 POST /apps/get */
export async function getApp(body: API.GetApplicationParams, options?: { [key: string]: any }) {
  const msg = await request<API.ResponseResult<API.ApplicationListItem>>('/apps/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
  msg.data.createdAt = Math.max(0, msg.data.createdAt ?? 0) * 1000;
  msg.data.updatedAt = Math.max(0, msg.data.updatedAt ?? 0) * 1000;
  return msg;
}

/** 新建应用程序 POST /apps */
export async function createApp(
  body: API.CreateApplicationParams,
  options?: { [key: string]: any },
) {
  return request<API.ResponseResult<API.ApplicationListItem>>('/apps', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新应用程序 PUT /apps */
export async function updateApp(
  body: API.UpdateApplicationParams,
  options?: { [key: string]: any },
) {
  return request<API.ResponseResult<API.ApplicationListItem>>('/apps', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取Secret GET /app/secret */
export async function getSecret(
  body: API.GetApplicationSecretParams,
  options?: { [key: string]: any },
) {
  return request<API.ResponseResult<string>>('/apps/secret', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
