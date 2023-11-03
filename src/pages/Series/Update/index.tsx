import {
  createTras,
  getAppList,
  getRedemptionList,
  getSeries,
  getSeriesActivityCandidatesList,
  getSeriesContractCandidatesList,
  getTraList,
  updateRedemptionRule,
  updateSeries,
  updateTras,
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
import { FormattedMessage, useIntl, useParams } from '@umijs/max';
import { Button, Card } from 'antd';
import { useEffect, useState } from 'react';
import { history } from 'umi';

const Form: React.FC = () => {
  const params = useParams();
  const id = params.id?.toString() ?? '';

  const [loading, setLoading] = useState<boolean>(true);
  const [step1Loading, setStep1Loading] = useState<boolean>(false);
  const [step2Loading, setStep2Loading] = useState<boolean>(false);
  const [step3Loading, setStep3Loading] = useState<boolean>(false);
  const [applicationList, setApplicationList] = useState<API.ApplicationListItem[]>();
  const [series, setSeries] = useState<API.SeriesListItem>();
  const [traList, setTraList] = useState<API.TraListItem[]>();
  const [redemptionList, setRedemptionList] = useState<API.RedemptionListItem[]>();
  const [contractCandidateList, setContractCandidateList] =
    useState<API.ContractCandidateListItem[]>();

  const onUpdateSeries = async (values: Record<string, any>) => {
    if (series) {
      setStep1Loading(true);
      try {
        const image = values.image[0];
        let imageUrl = series.image;

        if (image.uid !== '-1') {
          let file = new File([image.originFileObj], `${Date.now()}.png`, { type: image.type });
          const formData = new FormData();
          formData.append('file', file);
          formData.append('path', 'tra');
          let msg = await uploadFile(formData);
          imageUrl = msg.data.url;
        }

        const fields: API.UpdateSeriesParams = {
          id: series.id,
          appId: values.appId,
          title: values.title,
          description: values.description,
          image: imageUrl,
          startUnixTime: Date.parse(values.datetime[0]) / 1000,
          endUnixTime: Date.parse(values.datetime[1]) / 1000,
          status: parseInt(values.status),
          version: series.version,
          updateFields: ['title', 'description', 'image', 'startUnixTime', 'endUnixTime', 'status'],
        };
        const result = await updateSeries({ ...fields });
        setSeries(result.data);
        return true;
      } catch (error) {
        return false;
      } finally {
        setStep1Loading(false);
      }
    }
  };

  const onUpdateTras = async (values: Record<string, any>) => {
    const generateUpdatTras = async (contractCandidateList: API.ContractCandidateListItem[]) => {
      const tras: API.UpdateTrasListItem[] = [];
      for (const contractCandidate of contractCandidateList) {
        const traItem = traList?.find((tra) => tra.contractAddress === contractCandidate.address);
        if (traItem) {
          const image = values[`${traItem.contractAddress}_image`][0];
          const title = values[`${traItem.contractAddress}_title`];
          const description = values[`${traItem.contractAddress}_description`];

          let imageUrl =
            traList?.find((tra) => tra.contractAddress === contractCandidate.address)?.image || '';
          if (image.uid !== '-1') {
            let file = new File([image.originFileObj], `${Date.now()}.png`, { type: image.type });
            const formData = new FormData();
            formData.append('file', file);
            formData.append('path', 'tra');
            let msg = await uploadFile(formData);
            imageUrl = msg.data.url;
          }

          const tra: API.UpdateTrasListItem = {
            tra: {
              id: traItem.id,
              title: title,
              description: description,
              image: imageUrl,
              version: traItem.version,
            },
            updateFields: ['title', 'description', 'image'],
          };
          tras.push(tra);
        }
      }
      return tras;
    };

    const generateCreatTras = async (
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
      setStep2Loading(true);
      try {
        const traList = await generateUpdatTras(contractCandidateList);
        if (traList && traList.length > 0) {
          const fields: API.UpdateTrasParams = {
            items: traList,
          };
          const result = await updateTras({ ...fields });
          setTraList(result.data);
        } else {
          const traList = await generateCreatTras(series.id, contractCandidateList);
          const fields: API.CreateTrasParams = {
            seriesNodePath: values.activityCandidateId,
            seriesVersion: series.version,
            tras: traList,
          };
          const result = await createTras({ ...fields });
          setTraList(result.data);
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      } finally {
        setStep2Loading(false);
      }
    } else {
      return false;
    }
  };

  const onUpdateRedemptionRule = async (values: Record<string, any>) => {
    if (series && traList) {
      setStep3Loading(true);
      try {
        const ruleList = values.ruleList;
        const redemptionRuleList: API.UpdateRedemptionRuleItem[] = [];
        for (const rule of ruleList) {
          const redemption = redemptionList?.find(
            (redemption) => redemption.redemptionRule.id === rule.id,
          );
          const redemptionRule = redemption?.redemptionRule;
          const redemptionTraInfos = redemption?.redemptionTraInfos;

          if (redemptionRule && redemptionTraInfos) {
            const image = rule.image[0];
            let imageUrl = redemptionRule.image;

            if (image.uid !== '-1') {
              let file = new File([image.originFileObj], `${Date.now()}.png`, { type: image.type });
              const formData = new FormData();
              formData.append('file', file);
              formData.append('path', 'tra');
              let msg = await uploadFile(formData);
              imageUrl = msg.data.url;
            }

            const updateRedemptionRule: API.UpdateRedemptionRule = {
              id: redemptionRule.id,
              seriesId: redemptionRule.seriesId,
              title: rule.title,
              description: rule.description,
              image: imageUrl,
              version: redemptionRule.version,
            };

            const traInfoList = rule.traInfoList;
            const updateRedemptionTraInfoList: API.UpdateRedemptionTraInfoItem[] = [];
            for (const traInfo of traInfoList) {
              const redemptionTraInfo = redemptionTraInfos.find(
                (redemptionTraInfo) => redemptionTraInfo.id === traInfo.id,
              );
              if (redemptionTraInfo) {
                const updateRedemptionTraInfoItem: API.UpdateRedemptionTraInfoItem = {
                  id: redemptionTraInfo.id,
                  redemptionId: redemptionTraInfo.redemptionId,
                  traId: traInfo.traId,
                  quantity: traInfo.quantity,
                  version: redemptionTraInfo.version,
                };
                updateRedemptionTraInfoList.push(updateRedemptionTraInfoItem);
              }
            }
            const redemptionRuleItem: API.UpdateRedemptionRuleItem = {
              redemptionRule: updateRedemptionRule,
              redemptionTraInfos: updateRedemptionTraInfoList,
            };
            redemptionRuleList.push(redemptionRuleItem);
          }
        }
        await updateRedemptionRule({ items: redemptionRuleList });
        return true;
      } catch (error) {
        console.log(error);
        return false;
      } finally {
        setStep3Loading(false);
      }
    } else {
      return false;
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);

        const msgApplist = await getAppList({ current: 1, pageSize: 999 });
        const applicationList = msgApplist.data;
        setApplicationList(applicationList);

        const msgSeries = await getSeries({ id });
        const series = msgSeries.data;
        setSeries(series);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  return (
    <PageContainer loading={loading}>
      <Card bordered={false}>
        {series && (
          <StepsForm
            submitter={{
              render: (props) => {
                if (props.step === 0) {
                  return (
                    <Button
                      type="primary"
                      onClick={() => props.onSubmit?.()}
                      loading={step1Loading}
                    >
                      保存
                    </Button>
                  );
                }

                if (props.step === 1) {
                  return (
                    <Button
                      type="primary"
                      onClick={() => props.onSubmit?.()}
                      loading={step2Loading}
                    >
                      保存
                    </Button>
                  );
                }

                if (props.step === 2) {
                  return (
                    <Button
                      type="primary"
                      onClick={() => props.onSubmit?.()}
                      loading={step3Loading}
                    >
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
              request={async () => {
                return {
                  appId: series.appId,
                  image: [
                    {
                      uid: '-1',
                      name: series.image.substring(series.image.lastIndexOf('/') + 1),
                      status: 'done',
                      url: series.image,
                    },
                  ],
                  title: series.title,
                  description: series.description,
                  datetime: [
                    new Date(series.startUnixTime).toISOString(),
                    new Date(series.endUnixTime).toISOString(),
                  ],
                  status: series.status.toString(),
                };
              }}
              onFinish={async (values) => {
                return await onUpdateSeries(values);
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
                  const res = applicationList?.map((item) => ({
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
                    <FormattedMessage
                      id="pages.seriesTable.status.active"
                      defaultMessage="运行中"
                    />
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
              request={async () => {
                const traListMap: Record<string, any> = {};
                if (series && series.nodePath !== '') {
                  const msgContractCandidateList = await getSeriesContractCandidatesList({
                    inmeritsNodePath: series.nodePath,
                  });
                  const contractCandidates = msgContractCandidateList.data;
                  setContractCandidateList(contractCandidates);
                  const msgTraList = await getTraList({
                    current: 1,
                    pageSize: 999,
                    seriesId: series.id,
                  });
                  const tras = msgTraList.data;
                  setTraList(tras);
                  tras.forEach((tra) => {
                    traListMap[`${tra.contractAddress}_image`] = [
                      {
                        uid: '-1',
                        name: tra.image.substring(tra.image.lastIndexOf('/') + 1),
                        status: 'done',
                        url: tra.image,
                      },
                    ];
                    traListMap[`${tra.contractAddress}_title`] = tra.title;
                    traListMap[`${tra.contractAddress}_description`] = tra.description;
                  });
                  return {
                    activityCandidateId: series.nodePath,
                    ...traListMap,
                  };
                }
                return {
                  ...traListMap,
                };
              }}
              onFinish={async (values) => {
                return await onUpdateTras(values);
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
              request={async () => {
                const redemptionRuleList: Record<string, any>[] = [];
                if (series) {
                  const msgRedemptionList = await getRedemptionList({
                    seriesId: series.id,
                  });
                  const redemptionList = msgRedemptionList.data;
                  setRedemptionList(redemptionList);

                  redemptionList.forEach((redemption) => {
                    const redemptionRuleMap: Record<string, any> = {};
                    const redemptionRule = redemption.redemptionRule;
                    const redemptionTraInfos = redemption.redemptionTraInfos;
                    redemptionRuleMap.image = [
                      {
                        uid: '-1',
                        name: redemptionRule.image.substring(
                          redemptionRule.image.lastIndexOf('/') + 1,
                        ),
                        status: 'done',
                        url: redemptionRule.image,
                      },
                    ];
                    redemptionRuleMap.id = redemptionRule.id;
                    redemptionRuleMap.title = redemptionRule.title;
                    redemptionRuleMap.description = redemptionRule.description;
                    redemptionRuleMap.traInfoList = [];
                    redemptionTraInfos.forEach((redemptionTraInfo) => {
                      const redemptionTraInfoMap: Record<string, any> = {};
                      redemptionTraInfoMap.id = redemptionTraInfo.id;
                      redemptionTraInfoMap.traId = redemptionTraInfo.traId;
                      redemptionTraInfoMap.quantity = redemptionTraInfo.quantity;
                      redemptionRuleMap.traInfoList.push(redemptionTraInfoMap);
                    });
                    redemptionRuleList.push(redemptionRuleMap);
                  });
                }
                return { ruleList: redemptionRuleList };
              }}
              onFinish={async (values) => {
                const result = await onUpdateRedemptionRule(values);
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
                alwaysShowItemLabel
              >
                <Card style={{ marginBottom: 16 }}>
                  <ProFormText name="id" fieldProps={{ disabled: true }} hidden />
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
                  >
                    {traList && (
                      <ProFormGroup>
                        <ProFormText name="id" fieldProps={{ disabled: true }} hidden />
                        <ProFormSelect
                          name="traId"
                          width="sm"
                          label={intl.formatMessage({
                            id: 'pages.series.redemption.rule.tra.title',
                            defaultMessage: 'TRA名称',
                          })}
                          request={async () => {
                            const result = traList?.map((tra) => {
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
        )}
      </Card>
    </PageContainer>
  );
};

export default Form;
