import { getRedemptionList, getSeries, getTra, getTraList } from '@/services/ant-design-pro/api';
import {
  ProCard,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Card, Image } from 'antd';
import Meta from 'antd/es/card/Meta';
import React, { useState } from 'react';
import { useParams } from 'umi';

const Form: React.FC = () => {
  const params = useParams();
  const id = params.id?.toString() ?? '';
  const [traList, setTraList] = useState<API.TraListItem[]>();
  const [redemptionList, setRedemptionList] = useState<API.RedemptionListItem[]>();

  const columns: ProColumns<API.SeriesListItem>[] = [
    {
      title: <FormattedMessage id="pages.series.appId" defaultMessage="AppID" />,
      dataIndex: 'appId',
      ellipsis: true,
    },
    {
      title: <FormattedMessage id="pages.series.image" defaultMessage="封面" />,
      dataIndex: 'image',
      valueType: 'image',
    },
    {
      title: <FormattedMessage id="pages.series.title" defaultMessage="标题" />,
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: <FormattedMessage id="pages.series.desc" defaultMessage="描述" />,
      dataIndex: 'description',
      valueType: 'textarea',
      ellipsis: true,
    },
    {
      title: <FormattedMessage id="pages.series.startDatetime" defaultMessage="开始时间" />,
      dataIndex: 'startUnixTime',
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="pages.series.endDatetime" defaultMessage="结束时间" />,
      dataIndex: 'endUnixTime',
      valueType: 'dateTime',
    },
  ];

  const columnsTra: ProColumns<API.RedemptionInfoTraListItem>[] = [
    {
      title: <FormattedMessage id="pages.series.redemption.tra.image" defaultMessage="封面" />,
      dataIndex: 'image',
      valueType: 'image',
    },
    {
      title: <FormattedMessage id="pages.series.redemption.tra.title" defaultMessage="标题" />,
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: <FormattedMessage id="pages.series.redemption.tra.desc" defaultMessage="描述" />,
      dataIndex: 'description',
      valueType: 'textarea',
      ellipsis: true,
    },
    {
      title: <FormattedMessage id="pages.series.redemption.tra.quantity" defaultMessage="数量" />,
      dataIndex: 'quantity',
      ellipsis: true,
    },
  ];

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  return (
    <PageContainer>
      <Card>
        <ProDescriptions<API.SeriesListItem>
          column={1}
          request={async () => {
            const series = (await getSeries({ id: id })).data;
            const traList = (await getTraList({ current: 1, pageSize: 999, seriesId: series.id }))
              .data;
            setTraList(traList);
            const redemptionList = (await getRedemptionList({ seriesId: id })).data;
            setRedemptionList(redemptionList);
            return {
              data: series || {},
            };
          }}
          columns={columns as ProDescriptionsItemProps<API.SeriesListItem>[]}
        />
        {traList && (
          <ProCard
            title={intl.formatMessage({
              id: 'pages.series.tra.list',
              defaultMessage: 'TRA列表',
            })}
            direction="row"
            ghost
            wrap
          >
            {traList.map((tra) => {
              return (
                <ProCard key={tra.id} colSpan={{ xs: 8, sm: 8, md: 8, lg: 8, xl: 8 }}>
                  <Card
                    cover={<Image style={{ objectFit: 'contain' }} height={160} src={tra.image} />}
                  >
                    <Meta title={tra.title} description={tra.description} />
                  </Card>
                </ProCard>
              );
            })}
          </ProCard>
        )}
        {redemptionList && (
          <ProCard
            title={intl.formatMessage({
              id: 'pages.series.redemption.list',
              defaultMessage: '兑换列表',
            })}
            direction="row"
            ghost
            wrap
          >
            {redemptionList.map((redemption) => {
              let redemptionRule: API.RedemptionRule = redemption.redemptionRule;
              let redemptionTraInfos: API.RedemptionTraInfo[] = redemption.redemptionTraInfos;
              return (
                <ProCard
                  key={redemptionRule.id}
                  colSpan={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
                >
                  <Card
                    cover={
                      <Image
                        style={{ objectFit: 'contain' }}
                        height={160}
                        src={redemptionRule.image}
                      />
                    }
                  >
                    <Meta
                      style={{ marginBottom: 16 }}
                      title={redemptionRule.title}
                      description={redemptionRule.description}
                    />

                    {redemptionTraInfos && (
                      <ProTable<API.RedemptionInfoTraListItem>
                        search={false}
                        pagination={false}
                        toolBarRender={false}
                        bordered={true}
                        columns={columnsTra}
                        rowKey={(item) => `${redemptionRule.id}_${item.id}`}
                        request={async () => {
                          const redemptionInfoTraList: API.RedemptionInfoTraListItem[] = [];
                          for (const redemptionTraInfo of redemptionTraInfos) {
                            const tra = (await getTra({ id: redemptionTraInfo.traId })).data;
                            if (tra) {
                              const redemptionInfoTra: API.RedemptionInfoTraListItem = {
                                id: tra.id,
                                image: tra.image,
                                title: tra.title,
                                description: tra.description,
                                quantity: redemptionTraInfo.quantity,
                              };
                              redemptionInfoTraList.push(redemptionInfoTra);
                            }
                          }
                          return {
                            data: redemptionInfoTraList,
                            total: redemptionInfoTraList.length,
                            success: true,
                            pageSize: redemptionInfoTraList.length,
                            current: 1,
                          };
                        }}
                      />
                    )}
                  </Card>
                </ProCard>
              );
            })}
          </ProCard>
        )}
      </Card>
    </PageContainer>
  );
};

export default Form;
