import { login } from '@/services/ant-design-pro/api';
import { LoginIdType, LoginType } from '@/services/ant-design-pro/enum';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { FormattedMessage, Helmet, history, useIntl, useModel } from '@umijs/max';
import { message } from 'antd';
import React from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';

const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const loginType = LoginType.Password;
  const loginIdType = LoginIdType.Email;

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    // 登录
    const msg = await login({ ...values });
    const data = msg.data;
    if (data) {
      localStorage.setItem('token', data);
      const defaultLoginSuccessMessage = intl.formatMessage({
        id: 'pages.login.success',
        defaultMessage: '登录成功！',
      });
      message.success(defaultLoginSuccessMessage);
      await fetchUserInfo();
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get('redirect') || '/');
      return;
    }
  };

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '登录页',
          })}
          - {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="./logo.svg" />}
          title={intl.formatMessage({
            id: 'pages.layouts.userLayout.title',
            defaultMessage: 'TRA',
          })}
          subTitle={intl.formatMessage({
            id: 'pages.layouts.userLayout.subtitle',
            defaultMessage: 'TRA后台管理系统',
          })}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
          submitter={{
            searchConfig: {
              submitText: <FormattedMessage id="pages.login.submit" defaultMessage="登录" />,
            },
          }}
        >
          <h3
            style={{
              marginBottom: 24,
            }}
          >
            <FormattedMessage id="menu.login" defaultMessage="登录" />
          </h3>

          <ProFormText
            name="loginId"
            fieldProps={{
              size: 'large',
              prefix: <MailOutlined />,
            }}
            placeholder={intl.formatMessage({
              id: 'pages.login.email.placeholder',
              defaultMessage: '邮箱',
            })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.email.required"
                    defaultMessage="邮箱是必填项！"
                  />
                ),
              },
              {
                type: 'email',
                message: (
                  <FormattedMessage
                    id="pages.login.email.invalid"
                    defaultMessage="邮箱地址格式错误！"
                  />
                ),
              },
            ]}
          />
          <ProFormText.Password
            name="loginPassword"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder={intl.formatMessage({
              id: 'pages.login.password.placeholder',
              defaultMessage: '密码',
            })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.password.required"
                    defaultMessage="请输入密码！"
                  />
                ),
              },
            ]}
          />
          <ProFormText
            name="loginType"
            initialValue={loginType}
            fieldProps={{ disabled: true }}
            hidden
          />
          <ProFormText
            name="loginIdType"
            initialValue={loginIdType}
            fieldProps={{ disabled: true }}
            hidden
          />
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;
