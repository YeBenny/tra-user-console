import { getSeries, getSeriesList } from '@/services/ant-design-pro/api';
import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl } from '@umijs/max';
import { Button, Drawer, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';

const List: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.SeriesListItem>();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.SeriesListItem>[] = [
    {
      title: <FormattedMessage id="pages.seriesTable.id" defaultMessage="ID" />,
      dataIndex: 'id',
      ellipsis: true,
    },
    {
      title: <FormattedMessage id="pages.seriesTable.appId" defaultMessage="AppID" />,
      dataIndex: 'appId',
      ellipsis: true,
    },
    {
      title: <FormattedMessage id="pages.seriesTable.image" defaultMessage="封面" />,
      dataIndex: 'image',
      valueType: 'image',
    },
    {
      title: <FormattedMessage id="pages.seriesTable.title" defaultMessage="标题" />,
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: <FormattedMessage id="pages.seriesTable.desc" defaultMessage="描述" />,
      dataIndex: 'description',
      valueType: 'textarea',
      ellipsis: true,
    },
    {
      title: <FormattedMessage id="pages.seriesTable.startDatetime" defaultMessage="开始时间" />,
      dataIndex: 'startUnixTime',
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="pages.seriesTable.endDatetime" defaultMessage="结束时间" />,
      dataIndex: 'endUnixTime',
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="pages.seriesTable.status" defaultMessage="状态" />,
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: <FormattedMessage id="pages.seriesTable.status.inactive" defaultMessage="已关闭" />,
          status: 'Default',
        },
        1: {
          text: <FormattedMessage id="pages.seriesTable.status.active" defaultMessage="运行中" />,
          status: 'Processing',
        },
      },
    },
    {
      title: <FormattedMessage id="pages.seriesTable.operation" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Tooltip
          key="view"
          title={<FormattedMessage id="pages.seriesTable.actions.view" defaultMessage="查看" />}
        >
          <Button
            shape="circle"
            icon={<EyeOutlined />}
            onClick={() => {
              setCurrentRow(record);
              history.push(`/series/${record.id}`);
            }}
          />
        </Tooltip>,
        <Tooltip
          key="edit"
          title={<FormattedMessage id="pages.seriesTable.actions.edit" defaultMessage="修改" />}
        >
          <Button
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentRow(record);
              history.push(`/series/${record.id}/update`);
            }}
          />
        </Tooltip>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.SeriesListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.seriesTable.title',
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
              history.push('/series/create');
            }}
          >
            <PlusOutlined />{' '}
            <FormattedMessage id="pages.seriesTable.actions.new" defaultMessage="新建" />
          </Button>,
        ]}
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
        request={getSeriesList}
        columns={columns}
      />
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
            title={currentRow?.title}
            request={async () => {
              const msg = await getSeries({ id: currentRow.id });
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
