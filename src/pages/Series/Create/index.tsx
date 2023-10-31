import {
  createRedemptionRule,
  createSeries,
  createTras,
  getAppList,
  getSeriesActivityCandidatesList,
  getSeriesContractCandidatesList,
  uploadFile,
} from '@/services/ant-design-pro/api';
import {
  ProFormDateTimeRangePicker,
  ProFormDigit,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
  StepsForm,
} from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Card } from 'antd';
import { useState } from 'react';
import { history } from 'umi';

const Form: React.FC = () => {
  const [series, setSeries] = useState<API.SeriesListItem>();
  const [traList, setTraList] = useState<API.TraListItem[]>();
  const [contractCandidateList, setContractCandidateList] =
    useState<API.ContractCandidateListItem[]>();

  const onCreateSeries = async (values: Record<string, any>) => {
    try {
      const image = values.image[0];
      let file = new File([image.originFileObj], `${Date.now()}.png`, { type: image.type });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', 'tra');

      let msg = await uploadFile(formData);
      const imageUrl = msg.data.url;
      const fields: API.CreateSeriesParams = {
        appId: values.appId,
        title: values.title,
        description: values.description,
        image: imageUrl,
        startUnixTime: Date.parse(values.datetime[0]) / 1000,
        endUnixTime: Date.parse(values.datetime[1]) / 1000,
        status: parseInt(values.status),
      };
      const result = await createSeries({ ...fields });
      setSeries(result.data);
      return true;
    } catch (error) {
      return false;
    }
  };

  const onCreateTras = async (values: Record<string, any>) => {
    const generateTras = async (
      seriesId: string,
      contractCandidateList: API.ContractCandidateListItem[],
    ): Promise<API.CreateTrasListItem[]> => {
      const tras: API.CreateTrasListItem[] = [];
      for (const contractCandidate of contractCandidateList) {
        const image = values[`${contractCandidate.address}_image`][0];
        const title = values[`${contractCandidate.address}_title`];
        const description = values[`${contractCandidate.address}_description`];
        let file = new File([image.originFileObj], `${Date.now()}.png`, { type: image.type });
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', 'tra');

        let msg = await uploadFile(formData);
        const imageUrl = msg.data.url;
        const tra: API.CreateTrasListItem = {
          seriesId: seriesId,
          title: title,
          description: description,
          image: imageUrl,
          contractAddress: contractCandidate.address,
          issueRuleId:
            contractCandidate.issueRules && contractCandidate.issueRules.length > 0
              ? contractCandidate.issueRules[0].issueRuleName
              : '',
        };
        tras.push(tra);
      }
      return tras;
    };

    if (series && contractCandidateList) {
      try {
        const traList = await generateTras(series.id, contractCandidateList);
        const fields: API.CreateTrasParams = {
          seriesNodePath: values.activityCandidateId,
          seriesVersion: series.version,
          tras: traList,
        };
        const msg = await createTras({ ...fields });
        setTraList(msg.data);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    } else {
      return false;
    }
  };

  const onCreateRedemptionRule = async (values: Record<string, any>) => {
    if (series && traList) {
      try {
        const ruleList = values.ruleList;
        const redemptionRuleList: API.CreateRedemptionRuleItem[] = [];
        for (const rule of ruleList) {
          const image = rule.image[0];
          let file = new File([image.originFileObj], `${Date.now()}.png`, { type: image.type });
          const formData = new FormData();
          formData.append('file', file);
          formData.append('path', 'tra');

          let msg = await uploadFile(formData);
          const imageUrl = msg.data.url;

          const redemptionRule: API.CreateRedemptionRule = {
            seriesId: series.id,
            title: rule.title,
            description: rule.description,
            image: imageUrl,
          };

          const traInfoList = rule.traInfoList;
          const redemptionTraInfoList: API.CreateRedemptionTraInfoItem[] = [];
          for (const traInfo of traInfoList) {
            const redemptionTraInfoItem: API.CreateRedemptionTraInfoItem = {
              traId: traInfo.traId,
              quantity: traInfo.quantity,
            };
            redemptionTraInfoList.push(redemptionTraInfoItem);
          }
          const redemptionRuleItem: API.CreateRedemptionRuleItem = {
            redemptionRule: redemptionRule,
            redemptionTraInfos: redemptionTraInfoList,
          };
          redemptionRuleList.push(redemptionRuleItem);
        }
        await createRedemptionRule({ items: redemptionRuleList });
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    } else {
      return false;
    }
  };

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  return (
    <PageContainer>
      <Card bordered={false}>
        <StepsForm
          submitter={{
            render: (props) => {
              if (props.step === 0) {
                return (
                  <Button type="primary" onClick={() => props.onSubmit?.()}>
                    保存
                  </Button>
                );
              }

              if (props.step === 1) {
                return (
                  <Button type="primary" onClick={() => props.onSubmit?.()}>
                    保存
                  </Button>
                );
              }

              if (props.step === 2) {
                return (
                  <Button type="primary" onClick={() => props.onSubmit?.()}>
                    提交
                  </Button>
                );
              }
            },
          }}
        >
          <StepsForm.StepForm
            title={intl.formatMessage({
              id: 'pages.series.step1.title',
              defaultMessage: '创建系列',
            })}
            stepProps={{
              description: intl.formatMessage({
                id: 'pages.series.step1.desc',
                defaultMessage: '填入系列基本信息',
              }),
            }}
            onFinish={async (values) => {
              return await onCreateSeries(values);
            }}
          >
            <ProFormSelect
              name="appId"
              width="md"
              label={intl.formatMessage({
                id: 'pages.series.appId',
                defaultMessage: 'AppID',
              })}
              request={async () => {
                const msg = await getAppList({ current: 1, pageSize: 999 });
                const res = msg.data.map((item) => ({
                  label: item.name,
                  value: item.id,
                }));
                return res || [];
              }}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.series.appId.required"
                      defaultMessage="AppID必填项！"
                    />
                  ),
                },
              ]}
            ></ProFormSelect>
            <ProFormUploadButton
              name="image"
              fieldProps={{
                beforeUpload: () => false,
              }}
              max={1}
              label={intl.formatMessage({
                id: 'pages.series.image',
                defaultMessage: '封面',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.series.image.required"
                      defaultMessage="封面是必填项！"
                    />
                  ),
                },
              ]}
              accept="image/*"
            ></ProFormUploadButton>
            <ProFormText
              name="title"
              width="md"
              label={intl.formatMessage({
                id: 'pages.series.title',
                defaultMessage: '标题',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.series.title.required"
                      defaultMessage="标题是必填项！"
                    />
                  ),
                },
              ]}
              placeholder={intl.formatMessage({
                id: 'pages.series.title.placeholder',
                defaultMessage: '标题',
              })}
            />
            <ProFormTextArea
              name="description"
              width="xl"
              label={intl.formatMessage({
                id: 'pages.series.desc',
                defaultMessage: '描述',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.series.desc.required"
                      defaultMessage="描述是必填项！"
                    />
                  ),
                },
              ]}
              placeholder={intl.formatMessage({
                id: 'pages.series.desc.placeholder',
                defaultMessage: '描述',
              })}
            />
            <ProFormDateTimeRangePicker
              name="datetime"
              width="xl"
              label={intl.formatMessage({
                id: 'pages.series.datetime',
                defaultMessage: '系列时间',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.series.datetime.required"
                      defaultMessage="系列时间是必填项！"
                    />
                  ),
                },
              ]}
              placeholder={[
                intl.formatMessage({
                  id: 'pages.series.startDatetime.placeholder',
                  defaultMessage: '开始时间',
                }),
                intl.formatMessage({
                  id: 'pages.series.endDatetime.placeholder',
                  defaultMessage: '结束时间',
                }),
              ]}
            />
            <ProFormSelect
              name="status"
              width="md"
              label={intl.formatMessage({
                id: 'pages.series.status',
                defaultMessage: '状态',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.seriesTable.status.required"
                      defaultMessage="状态必填项！"
                    />
                  ),
                },
              ]}
              valueEnum={{
                0: (
                  <FormattedMessage
                    id="pages.seriesTable.status.inactive"
                    defaultMessage="已关闭"
                  />
                ),
                1: (
                  <FormattedMessage id="pages.seriesTable.status.active" defaultMessage="运行中" />
                ),
              }}
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            title={intl.formatMessage({
              id: 'pages.series.step2.title',
              defaultMessage: '设置模版',
            })}
            stepProps={{
              description: intl.formatMessage({
                id: 'pages.series.step2.desc',
                defaultMessage: '填入系列模版和TRA',
              }),
            }}
            onFinish={async (values) => {
              return await onCreateTras(values);
            }}
          >
            <ProFormSelect
              name="activityCandidateId"
              width="md"
              label={intl.formatMessage({
                id: 'pages.series.seriesTemplate',
                defaultMessage: '系列模版',
              })}
              request={async () => {
                const msg = await getSeriesActivityCandidatesList();
                const res = msg.data.map((item) => ({
                  label: item.name,
                  value: item.id,
                }));
                return res || [];
              }}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.series.activityCandidate.required"
                      defaultMessage="系列模版必填项！"
                    />
                  ),
                },
              ]}
              onChange={async (activityCandidateId) => {
                const msg = await getSeriesContractCandidatesList({
                  inmeritsNodePath: activityCandidateId as string,
                });
                setContractCandidateList(msg.data);
              }}
            ></ProFormSelect>
            {contractCandidateList &&
              contractCandidateList.length > 0 &&
              contractCandidateList.map((contractCandidate) => {
                return (
                  <Card
                    style={{ marginBottom: 16 }}
                    key={contractCandidate.id}
                    title={contractCandidate.name}
                  >
                    <ProFormUploadButton
                      name={`${contractCandidate.address}_image`}
                      fieldProps={{
                        beforeUpload: () => false,
                      }}
                      max={1}
                      label={intl.formatMessage({
                        id: 'pages.series.image',
                        defaultMessage: '封面',
                      })}
                      rules={[
                        {
                          required: true,
                          message: (
                            <FormattedMessage
                              id="pages.series.image.required"
                              defaultMessage="封面是必填项！"
                            />
                          ),
                        },
                      ]}
                      accept="image/*"
                    ></ProFormUploadButton>
                    <ProFormText
                      name={`${contractCandidate.address}_title`}
                      width="md"
                      label={intl.formatMessage({
                        id: 'pages.series.title',
                        defaultMessage: '标题',
                      })}
                      rules={[
                        {
                          required: true,
                          message: (
                            <FormattedMessage
                              id="pages.series.title.required"
                              defaultMessage="标题是必填项！"
                            />
                          ),
                        },
                      ]}
                      placeholder={intl.formatMessage({
                        id: 'pages.series.title.placeholder',
                        defaultMessage: '标题',
                      })}
                    />
                    <ProFormTextArea
                      name={`${contractCandidate.address}_description`}
                      width="xl"
                      label={intl.formatMessage({
                        id: 'pages.series.desc',
                        defaultMessage: '描述',
                      })}
                      rules={[
                        {
                          required: true,
                          message: (
                            <FormattedMessage
                              id="pages.series.desc.required"
                              defaultMessage="描述是必填项！"
                            />
                          ),
                        },
                      ]}
                      placeholder={intl.formatMessage({
                        id: 'pages.series.desc.placeholder',
                        defaultMessage: '描述',
                      })}
                    />
                  </Card>
                );
              })}
          </StepsForm.StepForm>
          <StepsForm.StepForm
            title={intl.formatMessage({
              id: 'pages.series.step3.title',
              defaultMessage: '设置兑换',
            })}
            stepProps={{
              description: intl.formatMessage({
                id: 'pages.series.step3.desc',
                defaultMessage: '填入兑换规则',
              }),
            }}
            onFinish={async (values) => {
              const result = await onCreateRedemptionRule(values);
              if (result) {
                history.replace('/series/list');
                return true;
              }
              return false;
            }}
          >
            <ProFormList
              name={['ruleList']}
              label={intl.formatMessage({
                id: 'pages.series.redemption.title',
                defaultMessage: '兑换规则',
              })}
              initialValue={[{}]}
              alwaysShowItemLabel
            >
              <Card style={{ marginBottom: 16 }}>
                <ProFormUploadButton
                  name="image"
                  fieldProps={{
                    beforeUpload: () => false,
                  }}
                  max={1}
                  label={intl.formatMessage({
                    id: 'pages.series.redemption.rule.image',
                    defaultMessage: '封面',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.series.redemption.rule.image.required"
                          defaultMessage="封面是必填项！"
                        />
                      ),
                    },
                  ]}
                  accept="image/*"
                ></ProFormUploadButton>
                <ProFormText
                  name="title"
                  width="md"
                  label={intl.formatMessage({
                    id: 'pages.series.redemption.rule.title',
                    defaultMessage: '标题',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.series.redemption.rule.title.required"
                          defaultMessage="标题是必填项！"
                        />
                      ),
                    },
                  ]}
                  placeholder={intl.formatMessage({
                    id: 'pages.series.redemption.rule.title.placeholder',
                    defaultMessage: '标题',
                  })}
                />
                <ProFormTextArea
                  name="description"
                  width="xl"
                  label={intl.formatMessage({
                    id: 'pages.series.redemption.rule.desc',
                    defaultMessage: '描述',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.series.redemption.rule.desc.required"
                          defaultMessage="描述是必填项！"
                        />
                      ),
                    },
                  ]}
                  placeholder={intl.formatMessage({
                    id: 'pages.series.redemption.rule.desc.placeholder',
                    defaultMessage: '描述',
                  })}
                />
                <ProFormList
                  name={['traInfoList']}
                  label={intl.formatMessage({
                    id: 'pages.series.redemption.rule.tra.list',
                    defaultMessage: 'TRA列表',
                  })}
                  initialValue={[{}]}
                >
                  {traList && (
                    <ProFormGroup>
                      <ProFormSelect
                        name="traId"
                        width="sm"
                        label={intl.formatMessage({
                          id: 'pages.series.redemption.rule.tra.title',
                          defaultMessage: 'TRA名称',
                        })}
                        request={async () => {
                          const result = traList.map((tra) => {
                            return {
                              label: tra.title,
                              value: tra.id,
                            };
                          });
                          return result || [];
                        }}
                        rules={[
                          {
                            required: true,
                            message: (
                              <FormattedMessage
                                id="pages.series.redemption.rule.tra.title.required"
                                defaultMessage="TRA名称是必填项！"
                              />
                            ),
                          },
                        ]}
                        placeholder={intl.formatMessage({
                          id: 'pages.series.redemption.rule.tra.title.placeholder',
                          defaultMessage: 'TRA名称',
                        })}
                      />
                      <ProFormDigit
                        name="quantity"
                        width="sm"
                        label={intl.formatMessage({
                          id: 'pages.series.redemption.rule.tra.quantity',
                          defaultMessage: 'TRA数量',
                        })}
                        min={1}
                        rules={[
                          {
                            required: true,
                            message: (
                              <FormattedMessage
                                id="pages.series.redemption.rule.tra.quantity.required"
                                defaultMessage="TRA数量是必填项！"
                              />
                            ),
                          },
                        ]}
                        placeholder={intl.formatMessage({
                          id: 'pages.series.redemption.rule.tra.quantity.placeholder',
                          defaultMessage: 'TRA数量',
                        })}
                      />
                    </ProFormGroup>
                  )}
                </ProFormList>
              </Card>
            </ProFormList>
          </StepsForm.StepForm>
        </StepsForm>
      </Card>
    </PageContainer>
  );
};

export default Form;
