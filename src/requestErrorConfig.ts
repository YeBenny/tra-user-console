﻿import type { AxiosResponse, RequestConfig } from '@umijs/max';
import { message } from 'antd';
import { v4 as uuidv4 } from 'uuid';

// 错误处理方案： 错误类型
enum ErrorCode {
  SUCCESS = 0,
}

// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  errorCode?: ErrorCode;
  errorMessage?: string;
  errcode?: ErrorCode;
  errmsg?: string;
  data: any;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { success, data, errorCode, errorMessage } = res as unknown as ResponseStructure;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorCode, errorMessage } = errorInfo;
          switch (errorCode) {
            case ErrorCode.SUCCESS:
              // do nothing
              break;
            default:
              message.error(errorMessage);
              break;
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`Response status:${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (url: string, options: RequestConfig) => {
      // 拦截请求配置，进行个性化处理。
      const baseUrl = ENDPOINT;
      const token = localStorage.getItem('token');
      let requestIdHeader;
      if (token) {
        requestIdHeader = { 'X-Wegalaxy-Request-Id': uuidv4(), Authorization: `Bearer ${token}` };
      } else {
        requestIdHeader = { 'X-Wegalaxy-Request-Id': uuidv4() };
      }
      return {
        url: /^((http|https|ftp):\/\/)/.test(url) ? url : `${baseUrl}${url}`,
        options: { ...options, interceptors: true, headers: requestIdHeader },
      };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response: AxiosResponse) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as ResponseStructure;
      const errorCode = data.errorCode ?? data.errcode;
      const errorMessage = data.errorMessage ?? data.errmsg;
      if (errorCode !== undefined && errorMessage !== undefined) {
        response.data = {
          errorCode,
          errorMessage,
          data: data.data,
          success: errorCode === ErrorCode.SUCCESS,
        };
      } else {
        const url = new URL(response.request.responseURL);
        response.data = {
          errorCode,
          errorMessage,
          data: `${url.origin}${url.pathname}`,
          success: true,
        };
      }
      return response;
    },
  ],
};
