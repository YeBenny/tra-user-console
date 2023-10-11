import { createApp, getApp, getAppList, getSecret, updateApp } from '@/services/ant-design-pro/api';
import { EditOutlined, KeyOutlined, PlusOutlined } from '@ant-design/icons';
import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormInstance,
} from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Modal, Tooltip, message } from 'antd';
import React, { useRef, useState } from 'react';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.ApplicationListItem) => {
  const hide = message.loading('正在添加');
  try {
    await createApp({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.UpdateApplicationParams) => {
  const hide = message.loading('正在更新');
  try {
    await updateApp({ ...fields });
    hide();

    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    return false;
  }
};

const List: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const createModalFormRef = React.useRef<ProFormInstance>();
  const [createModalOpen, handleCreateModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const updateModalFormRef = React.useRef<ProFormInstance>();
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.ApplicationListItem>();
  const [modal, contextHolder] = Modal.useModal();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.ApplicationListItem>[] = [
    {
      title: <FormattedMessage id="pages.applicationTable.id" defaultMessage="AppID" />,
      dataIndex: 'id',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
      ellipsis: true,
      copyable: true,
    },
    {
      title: <FormattedMessage id="pages.applicationTable.name" defaultMessage="名称" />,
      dataIndex: 'name',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: <FormattedMessage id="pages.applicationTable.desc" defaultMessage="描述" />,
      dataIndex: 'description',
      valueType: 'textarea',
      ellipsis: true,
    },
    {
      title: <FormattedMessage id="pages.applicationTable.status" defaultMessage="状态" />,
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: (
            <FormattedMessage id="pages.applicationTable.status.inactive" defaultMessage="已关闭" />
          ),
          status: 'Default',
        },
        1: {
          text: (
            <FormattedMessage id="pages.applicationTable.status.active" defaultMessage="运行中" />
          ),
          status: 'Processing',
        },
      },
    },
    {
      title: <FormattedMessage id="pages.applicationTable.createdAt" defaultMessage="创建时间" />,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="pages.applicationTable.updatedAt" defaultMessage="更新时间" />,
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="pages.applicationTable.operation" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Tooltip
          key="edit"
          title={
            <FormattedMessage id="pages.applicationTable.actions.edit" defaultMessage="修改" />
          }
        >
          <Button
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => {
              handleUpdateModalOpen(true);
              setCurrentRow(record);
            }}
          />
        </Tooltip>,
        <Tooltip
          key="getSecret"
          title={
            <FormattedMessage
              id="pages.applicationTable.actions.getSecret"
              defaultMessage="获取AppSecret"
            />
          }
        >
          <Button
            shape="circle"
            icon={<KeyOutlined />}
            onClick={async () => {
              setCurrentRow(record);
              const msg = await getSecret({ appId: record.id });
              const secret = msg.data;
              modal.info({
                title: (
                  <FormattedMessage id="pages.applicationTable.secret" defaultMessage="AppSecret" />
                ),
                content: <>{secret}</>,
                onOk: async () => {
                  if (window.isSecureContext && navigator.clipboard) {
                    await navigator.clipboard.writeText(secret);
                  }
                },
                okText:
                  window.isSecureContext && navigator.clipboard ? (
                    <FormattedMessage
                      id="pages.applicationTable.actions.copy"
                      defaultMessage="复制"
                    />
                  ) : (
                    <FormattedMessage
                      id="pages.applicationTable.actions.ok"
                      defaultMessage="确认"
                    />
                  ),
                afterClose: () => {
                  setCurrentRow(undefined);
                },
              });
            }}
          />
        </Tooltip>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.ApplicationListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.applicationTable.title',
          defaultMessage: 'AppID列表',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleCreateModalOpen(true);
            }}
          >
            <PlusOutlined />{' '}
            <FormattedMessage id="pages.applicationTable.actions.new" defaultMessage="新建" />
          </Button>,
        ]}
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
        request={getAppList}
        columns={columns}
      />
      <ModalForm
        formRef={createModalFormRef}
        title={intl.formatMessage({
          id: 'pages.applicationTable.createForm.title',
          defaultMessage: '新建应用程序',
        })}
        width="400px"
        open={createModalOpen}
        onOpenChange={(visiable) => {
          if (visiable) {
            createModalFormRef.current?.setFieldValue('name', '');
            createModalFormRef.current?.setFieldValue('description', '');
          }
          handleCreateModalOpen(visiable);
        }}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.ApplicationListItem);
          if (success) {
            handleCreateModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          placeholder={intl.formatMessage({
            id: 'pages.applicationTable.name.placeholder',
            defaultMessage: '名称',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.applicationTable.name.required"
                  defaultMessage="名称是必填项！"
                />
              ),
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea
          placeholder={intl.formatMessage({
            id: 'pages.applicationTable.desc.placeholder',
            defaultMessage: '描述',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.applicationTable.desc.required"
                  defaultMessage="描述必填项！"
                />
              ),
            },
          ]}
          width="md"
          name="description"
        />
      </ModalForm>
      <ModalForm
        formRef={updateModalFormRef}
        title={intl.formatMessage({
          id: 'pages.applicationTable.udpateForm.title',
          defaultMessage: '更新应用程序',
        })}
        width="400px"
        open={updateModalOpen}
        onOpenChange={(visiable) => {
          if (visiable) {
            updateModalFormRef.current?.setFieldValue('name', currentRow?.name);
            updateModalFormRef.current?.setFieldValue('description', currentRow?.description);
            updateModalFormRef.current?.setFieldValue('status', `${currentRow?.status}`);
          }
          handleUpdateModalOpen(visiable);
        }}
        onFinish={async (value) => {
          if (currentRow !== undefined) {
            const body = {
              id: currentRow?.id,
              name: value.name,
              description: value.description,
              status: Number(value.status),
              version: currentRow?.version,
              updateFields: ['name', 'description', 'status'],
            };
            const success = await handleUpdate(body);
            if (success) {
              handleUpdateModalOpen(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }
        }}
      >
        <ProFormText
          placeholder={intl.formatMessage({
            id: 'pages.applicationTable.name.placeholder',
            defaultMessage: '名称',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.applicationTable.name.required"
                  defaultMessage="名称是必填项！"
                />
              ),
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea
          placeholder={intl.formatMessage({
            id: 'pages.applicationTable.desc.placeholder',
            defaultMessage: '描述',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.applicationTable.desc.required"
                  defaultMessage="描述必填项！"
                />
              ),
            },
          ]}
          width="md"
          name="description"
        />
        <ProFormSelect
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.applicationTable.status.required"
                  defaultMessage="状态必填项！"
                />
              ),
            },
          ]}
          valueEnum={{
            0: (
              <FormattedMessage
                id="pages.applicationTable.status.inactive"
                defaultMessage="已关闭"
              />
            ),
            1: (
              <FormattedMessage id="pages.applicationTable.status.active" defaultMessage="运行中" />
            ),
          }}
          width="md"
          name="status"
        />
      </ModalForm>
      {contextHolder}
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow && (
          <ProDescriptions<API.ApplicationListItem>
            column={1}
            title={currentRow?.name}
            request={async () => {
              const msg = await getApp({ id: currentRow.id });
              return {
                data: msg.data || currentRow || {},
              };
            }}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.ApplicationListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default List;
