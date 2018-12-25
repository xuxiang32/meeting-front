import React, { Component,Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Badge, Divider, message,Table,Modal} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import StandardTable from '@/components/StandardTable';
import styles from './TableList.less';
// import moment from 'moment';
const FormItem = Form.Item;
const {confirm} = Modal;
const statusMap = ['default', 'processing'];
const status = ['闲置', '使用中'];
const { Option } = Select;

const formlayout = {
  labelCol:{ span: 5 },
  wrapperCol:{ span: 15 }
};

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      let newFormVal = {};
      const newStatus = parseInt(fieldsValue.status);
      newFormVal = {
        ...fieldsValue,
        status: newStatus
      };
      if (err) return;
      form.resetFields();
      handleAdd(newFormVal);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新增会议室"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem {...formlayout} label="会议室名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入会议室名称！'}],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formlayout} label="状态">
        {form.getFieldDecorator('status', {
          rules: [{ required: true, message: '请输入会议室状态！'}],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            <Option value="0">闲置</Option>
            <Option value="1">使用中</Option>
          </Select>
        )}
      </FormItem>
      <FormItem {...formlayout} label="会议室门号">
        {form.getFieldDecorator('location', {
          rules: [{ required: true, message: '请输入会议室位置！'}],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ rule,loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()

class MeetingList extends Component {
  state = {
    expandForm: false,
    selectedRows: [],
    meetData:[],
    modalVisible: false
  };

  componentDidMount() {
    const {dispatch} = this.props;

    dispatch({
      type: 'rule/fetch',
    }).then((response)=>{
      // console.log('response+++',response.data);
      const newData = response.data.map((item,index)=>({
          ...item,
          key:`meet${index+1}`
        }));
      this.setState({
        meetData: newData
      })
    });
  }

  renderSimpleForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="会议室名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">闲置</Option>
                  <Option value="1">使用中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  renderForm = () => {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  };

  reloadTable = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'rule/fetch',
    }).then((response)=>{
      console.log('response+++',response.data);
      const newData = response.data.map((item,index)=>({
        ...item,
        key:`meet${index+1}`
      }));
      this.setState({
        meetData: newData
      })
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    console.info('fields',fields);
    dispatch({
      type: 'rule/addMeet',
      payload: {
        ...fields
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
    this.reloadTable();
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleDelete = (values) => {
    // console.info('values----',values);
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/deleteMeet',
      payload: values.id,
    });
    this.reloadTable();
  };

  showConfirm = (record) => {
    // console.log('record++++++',record);
    const _this = this;
    confirm({
      title: '删除提示框',
      content: '确认删除该会议室？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        _this.handleDelete(record);
      },
      onCancel() {
      },
    });
  };

  render() {
    const {
      rule: { data },
      loading
    } = this.props;

    const columns = [
      {
        title: '会议室名称',
        dataIndex: 'name',
        key:'meetname',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key:'meetstatus',
        render(val) {
          let newS = '';
          switch (val){
            case true :
              newS = 0;
              break;
            case false:
              newS = 1;
              break;
            default:
              break;
          }
          return <Badge status={statusMap[newS]} text={status[newS]} />;
        },
      },
      {
        title: '更新时间',
        dataIndex: 'updatetime',
        key:'meettime',
      },
      {
        title: '操作',
        key:'operate',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>预约</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleDetail(true, record)}>查看详情</a>
            <Divider type="vertical" />
            <a onClick={() => this.showConfirm(record)}>删除</a>
          </Fragment>
        ),
      },
    ];

    const { selectedRows , meetData , modalVisible } = this.state;
    // console.info('----meetData',meetData);
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderWrapper title="会议室列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <Table
              dataSource={meetData}
              columns={columns}
              loading={loading}
              rowKey="key"
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default MeetingList;
