/* eslint-disable prefer-const */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Badge,
  Divider,
  message,
  Table,
  Modal,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { formatMessage, FormattedMessage } from 'umi/locale';
import styles from './TableList.less';
import getErrMsg from '@/utils/handleErrCode';
// import moment from 'moment';
const FormItem = Form.Item;
const { confirm } = Modal;
const statusMap = ['default', 'processing'];
const status = ['闲置', '使用中'];
const { Option } = Select;

const formlayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, updateData } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      let newFormVal = {
        ...fieldsValue,
      };
      if (err) return;
      form.resetFields();
      handleAdd(newFormVal);
    });
  };
  return (
    <Modal
      destroyOnClose
      title={'添加用户'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem {...formlayout} label="所属部门">
        {form.getFieldDecorator('department', {
          initialValue: updateData.department ? updateData.department : '2',
          rules: [{ required: true, message: '请选择所属部门！' }],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            <Option value="1">管理员</Option>
            <Option value="2">员工</Option>
          </Select>
        )}
      </FormItem>
      <FormItem {...formlayout} label="姓名">
        {form.getFieldDecorator('username', {
          initialValue: updateData.username ? updateData.username : '',
          rules: [{ required: true, message: '请输入账号！' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formlayout} label="手机号">
        {form.getFieldDecorator('mobile', {
          initialValue: updateData.mobile ? updateData.mobile : '',
          rules: [{ required: true, message: '请输入用户名称！' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formlayout} label="密码">
        {form.getFieldDecorator('password', {
          rules: [{ required: true, message: '请输入密码！' }],
        })(<Input placeholder="请输入" type="password" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class UserList extends Component {
  state = {
    expandForm: false,
    selectedRows: [],
    meetData: [],
    modalVisible: false,
    updateData: {},
  };

  componentDidMount() {
    this.reloadTable();
  }

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };
      dispatch({
        type: 'rule/getUsers',
        payload: values,
      }).then(response => {
        console.info('response---', response);
      });
    });
  };

  renderSimpleForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
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
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/getUsers',
    }).then(response => {
      if (response.status === 'success') {
        const newData = response.data.map((item, index) => ({
          ...item,
          key: `meet${index + 1}`,
        }));
        this.setState({
          meetData: newData,
        });
      } else {
        message.error(getErrMsg(''));
      }
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    // console.info('fields',fields);
    dispatch({
      type: 'rule/addUsers',
      payload: {
        ...fields,
      },
    }).then(response => {
      // console.info(response);
      if (response.status === 'success') {
        message.success(getErrMsg('ADD_SUCCESS'));
        this.handleModalVisible();
        this.reloadTable();
      } else {
        message.error(getErrMsg(response.msg));
      }
    });
  };

  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
    });
    if (record) {
      this.setState({
        updateData: record,
      });
    }
  };

  handleDelete = values => {
    // console.info('values----',values);
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/deleteUsers',
      payload: values.id,
    }).then(response => {
      if (response.status === 'success') {
        message.success(getErrMsg('OPERATE_SUCCESS'));
        this.reloadTable();
      }
    });
  };

  showConfirm = record => {
    // console.log('record++++++',record);
    const that = this;
    confirm({
      title: '删除提示框',
      content: '确认删除该用户？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        that.handleDelete(record);
      },
      onCancel() {},
    });
  };

  render() {
    const {
      rule: { data },
      loading,
    } = this.props;
    // console.info('data----',data);
    const columns = [
      {
        title: '账户',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '部门',
        dataIndex: 'department',
        key: 'department',
        render: (text, record) => (
          <Fragment>
            {+record.department === 1 ? (
              <Badge status="error" text="管理员" />
            ) : (
              <Badge status="success" text="员工" />
            )}
          </Fragment>
        ),
      },
      {
        title: '创建时间',
        dataIndex: 'createdtime',
        key: 'createdtime',
      },
      {
        title: '最后一次登陆时间',
        dataIndex: 'logintime',
        key: 'logintime',
      },
      {
        title: '操作',
        key: 'operate',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleModalVisible(true, record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.showConfirm(record)}>删除</a>
          </Fragment>
        ),
      },
    ];

    const { selectedRows, meetData, modalVisible, updateData } = this.state;
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
      <PageHeaderWrapper title="用户列表">
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
            <Table dataSource={meetData} columns={columns} loading={loading} rowKey="key" />
          </div>
        </Card>
        <CreateForm {...parentMethods} updateData={updateData} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default UserList;
