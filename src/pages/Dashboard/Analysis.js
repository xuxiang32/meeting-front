import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Row, Col, Icon, Card, Tabs, Table, Radio,  Avatar, Tooltip, Menu, Dropdown, } from 'antd';
import { MiniArea, Pie } from '@/components/Charts';
import Trend from '@/components/Trend';
import NumberInfo from '@/components/NumberInfo';
import numeral from 'numeral';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Yuan from '@/utils/Yuan';
import { getTimeDistance } from '@/utils/utils';
import avarIcon from '@/assets/logo.svg';
import styles from './Analysis.less';

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class Analysis extends Component {
  constructor(props) {
    super(props);
    this.rankingListData = [];
    for (let i = 0; i < 7; i += 1) {
      this.rankingListData.push({
        title: formatMessage({ id: 'app.analysis.test' }, { no: i }),
        total: 323234,
      });
    }
  }

  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
    loading: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
      });
      this.timeoutId = setTimeout(() => {
        this.setState({
          loading: false,
        });
      }, 600);
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  }

  render() {
    const { rangePickerValue, salesType, loading: stateLoading, currentTabKey } = this.state;
    const { chart, loading: propsLoading } = this.props;
    const {
      visitData2,
      searchData,
      offlineData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
    } = chart;
    const loading = propsLoading || stateLoading;
    let salesPieData;
    if (salesType === 'all') {
      salesPieData = salesTypeData;
    } else {
      salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;
    }
    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const iconGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );

    const columns = [
      {
        title: <FormattedMessage id="app.analysis.table.rank" defaultMessage="Rank" />,
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: (
          <FormattedMessage
            id="app.analysis.table.search-keyword"
            defaultMessage="Search keyword"
          />
        ),
        dataIndex: 'keyword',
        key: 'keyword',
        render: text => <a href="/">{text}</a>,
      },
      {
        title: <FormattedMessage id="app.analysis.table.users" defaultMessage="Users" />,
        dataIndex: 'count',
        key: 'count',
        // sorter: (a, b) => a.count - b.count,
        className: styles.alignRight,
      },
      {
        title: (
          <FormattedMessage id="app.analysis.table.weekly-range" defaultMessage="Weekly Range" />
        ),
        dataIndex: 'range',
        key: 'range',
        // sorter: (a, b) => a.range - b.range,
        render: (text, record) => (
          <Trend flag={record.status === 1 ? 'down' : 'up'}>
            <span style={{ marginRight: 4 }}>{text}%</span>
          </Trend>
        ),
        align: 'right',
      },
    ];

    console.info('salesPieData',salesPieData);

    const handlePageContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar size="large" src={avarIcon} />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>
            Hi，码农，新的一天开始啦！！
          </div>
          <div>
          交互设计师 | 基础平台部－用户体验技术部－UED
          </div>
        </div>
      </div>
    );

    return (
      <PageHeaderWrapper
        content={handlePageContent}
      >
        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={loading}
              bordered={false}
              title={
                <FormattedMessage
                  id="app.analysis.user_list"
                  defaultMessage="用户组"
                />
              }
              extra={iconGroup}
              style={{ marginTop: 12 }}
            >
              <Row gutter={68}>
                <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
                  <NumberInfo
                    subTitle={
                      <span>
                        <FormattedMessage
                          id="app.analysis.single_users"
                          defaultMessage="个人用户"
                        />
                        <Tooltip
                          title={
                            <FormattedMessage
                              id="app.analysis.introduce"
                              defaultMessage="introduce"
                            />
                          }
                        >
                          <Icon style={{ marginLeft: 8 }} type="info-circle-o" />
                        </Tooltip>
                      </span>
                    }
                    gap={8}
                    total={numeral(12321).format('0,0')}
                    status="up"
                    subTotal={17.1}
                  />
                  <MiniArea line height={45} data={visitData2} />
                </Col>
                <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
                  <NumberInfo
                    subTitle={
                      <span>
                        <FormattedMessage
                          id="app.analysis.group_users"
                          defaultMessage="部门用户"
                        />
                        <Tooltip
                          title={
                            <FormattedMessage
                              id="app.analysis.introduce"
                              defaultMessage="introduce"
                            />
                          }
                        >
                          <Icon style={{ marginLeft: 8 }} type="info-circle-o" />
                        </Tooltip>
                      </span>
                    }
                    total={2.7}
                    status="down"
                    subTotal={26.2}
                    gap={8}
                  />
                  <MiniArea line height={45} data={visitData2} />
                </Col>
              </Row>
              <Table
                rowKey={record => record.index}
                size="small"
                columns={columns}
                dataSource={searchData}
                pagination={{
                  style: { marginBottom: 0 },
                  pageSize: 5,
                }}
              />
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={loading}
              className={styles.salesCard}
              bordered={false}
              title={
                <FormattedMessage
                  id="app.analysis.the-proportion-of-sales"
                  defaultMessage="The Proportion of Sales"
                />
              }
              bodyStyle={{ padding: 24 }}
              extra={
                <div className={styles.salesCardExtra}>
                  {iconGroup}
                  <div className={styles.salesTypeRadio}>
                    <Radio.Group value={salesType} onChange={this.handleChangeSalesType}>
                      <Radio.Button value="all">
                        <FormattedMessage id="app.analysis.channel.meet1" defaultMessage="ALL" />
                      </Radio.Button>
                      <Radio.Button value="online">
                        <FormattedMessage
                          id="app.analysis.channel.meet2"
                          defaultMessage="Online"
                        />
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
              }
              style={{ marginTop: 12, minHeight: 509 }}
            >
              <h4 style={{ marginTop: 8, marginBottom: 32 }}>
                <FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />
              </h4>
              <Pie
                hasLegend
                subTitle={<FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />}
                total={() => <Yuan>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</Yuan>}
                data={salesPieData}
                valueFormat={value => <Yuan>{value}</Yuan>}
                height={248}
                lineWidth={4}
              />
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default Analysis;
