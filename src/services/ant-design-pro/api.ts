// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { v4 as uuidv4 } from 'uuid';

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

/** 获取用户组织 GET / */
export async function getOrgnization(options?: { [key: string]: any }) {
  return request<API.ResponseResult<API.Organization>>('/organizations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/** 获取应用程序列表 POST /apps/list */
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

/** 获取Secret GET /apps/get-secret */
export async function getSecret(
  body: API.GetApplicationSecretParams,
  options?: { [key: string]: any },
) {
  return request<API.ResponseResult<string>>('/apps/get-secret', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取系列列表 POST /apps/series/list */
export async function getSeriesList(params: API.PageParams, options?: { [key: string]: any }) {
  const current = params.current ?? 1;
  const pageSize = params.pageSize ?? 10;
  const body = {
    pageInfo: {
      startIndex: (current - 1) * pageSize + 1,
      pageSize: pageSize,
    },
  };
  const msg = await request<API.ResponseResult<API.SeriesList>>('/apps/series/list', {
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
    item.startUnixTime = Math.max(0, item.startUnixTime ?? 0) * 1000;
    item.endUnixTime = Math.max(0, item.endUnixTime ?? 0) * 1000;
  });
  return {
    data: result,
    total: data.pageInfo?.totalRows,
    success: true,
    pageSize: pageSize,
    current: current,
  };
}

/** 获取系列 POST /apps/series/get */
export async function getSeries(body: API.GetSeriesParams, options?: { [key: string]: any }) {
  const msg = await request<API.ResponseResult<API.SeriesListItem>>('/apps/series/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
  msg.data.startUnixTime = Math.max(0, msg.data.startUnixTime ?? 0) * 1000;
  msg.data.endUnixTime = Math.max(0, msg.data.endUnixTime ?? 0) * 1000;
  return msg;
}

/** 新建系列 POST /apps/series */
export async function createSeries(body: API.CreateSeriesParams, options?: { [key: string]: any }) {
  return request<API.ResponseResult<API.SeriesListItem>>('/apps/series', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新系列 PUT /apps/series */
export async function updateSeries(body: API.UpdateSeriesParams, options?: { [key: string]: any }) {
  return request<API.ResponseResult<API.SeriesListItem>>('/apps/series', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取系列模版列表 POST /apps/series/list-activity-candidats */
export async function getSeriesActivityCandidatesList(options?: { [key: string]: any }) {
  return request<API.ResponseResult<API.ActivityCandidateListItem[]>>(
    '/apps/series/list-activity-candidates',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    },
  );
}

/** 获取系列模版列表 POST /apps/series/list-contract-candidats */
export async function getSeriesContractCandidatesList(
  body: API.GetContractCandidateListParams,
  options?: { [key: string]: any },
) {
  return request<API.ResponseResult<API.ContractCandidateListItem[]>>(
    '/apps/series/list-contract-candidates',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 新建TRA POST /apps/tras */
export async function createTras(body: API.CreateTrasParams, options?: { [key: string]: any }) {
  return request<API.ResponseResult<API.TraListItem[]>>('/tras', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新TRA POST /apps/tras */
export async function updateTras(body: API.UpdateTrasParams, options?: { [key: string]: any }) {
  return request<API.ResponseResult<API.TraListItem[]>>('/tras', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取TRA POST /tras/list */
export async function getTra(body: API.GetTraParams, options?: { [key: string]: any }) {
  return await request<API.ResponseResult<API.TraList>>('/tras/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取TRA列表 POST /tras/list */
export async function getTraList(params: API.TraPageParams, options?: { [key: string]: any }) {
  const current = params.current ?? 1;
  const pageSize = params.pageSize ?? 10;
  const body = {
    pageInfo: {
      startIndex: (current - 1) * pageSize + 1,
      pageSize: pageSize,
    },
    filters: [
      {
        name: 'seriesId',
        operator: 'equal',
        value: params.seriesId,
        valueType: 'string',
      },
    ],
  };
  const msg = await request<API.ResponseResult<API.TraList>>('/tras/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
  const data = msg.data;
  const result = data.result;
  return {
    data: result,
    total: data.pageInfo?.totalRows,
    success: true,
    pageSize: pageSize,
    current: current,
  };
}

/** 新建兑换规则 POST /apps/tras */
export async function createRedemptionRule(
  body: API.CreateRedemptionRuleParams,
  options?: { [key: string]: any },
) {
  return request<API.ResponseResult<API.RedemptionListItem[]>>('/apps/series/redemptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新兑换规则 POST /apps/tras */
export async function updateRedemptionRule(
  body: API.UpdateRedemptionRuleParams,
  options?: { [key: string]: any },
) {
  return request<API.ResponseResult<API.RedemptionListItem[]>>('/apps/series/redemptions', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取兑换规则列表 POST /tras/list */
export async function getRedemptionList(
  params: API.GetRedemptionListParams,
  options?: { [key: string]: any },
) {
  return await request<API.ResponseResult<API.RedemptionListItem[]>>(
    '/apps/series/redemptions/list',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: params,
      ...(options || {}),
    },
  );
}

/** 获取兑换报告列表 POST /apps/series/redemptions/list-report */
export async function getRedemptionReportList(
  params: API.RedemptionReportPageParams,
  options?: { [key: string]: any },
) {
  const current = params.current ?? 1;
  const pageSize = params.pageSize ?? 10;
  const body = {
    seriesId: params.seriesId,
    pageInfo: {
      startIndex: (current - 1) * pageSize + 1,
      pageSize: pageSize,
    },
  };
  const msg = await request<API.ResponseResult<API.RedemptionReportList>>(
    '/apps/series/redemptions/list-report',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
  const data = msg.data;
  const result = data.result;
  result?.forEach((item) => {
    item.createdAt = Math.round(new Date(item.createdAt).getTime());
    item.updatedAt = Math.round(new Date(item.updatedAt).getTime());
  });
  return {
    data: result,
    total: data.pageInfo?.totalRows,
    success: true,
    pageSize: pageSize,
    current: current,
  };
}

/** 下载兑换报告 POST /apps/series/redemptions/download-report */
export async function downloadReport(
  body: API.DownloadReportParams,
  options?: { [key: string]: any },
) {
  const token = localStorage.getItem('token');
  return await fetch(`${ENDPOINT}/apps/series/redemptions/download-report`, {
    method: 'POST',
    headers: {
      'X-Wegalaxy-Request-Id': uuidv4(),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    ...(options || {}),
  });
}

/** 获取文件上传URL POST /files/upload */
export async function uploadFile(formData: FormData, options?: { [key: string]: any }) {
  return request<API.ResponseResult<{ [key: string]: any }>>('/files/upload', {
    method: 'POST',
    headers: {
      'Content-type': 'multipart/form-data',
    },
    data: formData,
    ...(options || {}),
  });
}
