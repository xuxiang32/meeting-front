/* eslint-disable react/destructuring-assignment,react/jsx-curly-spacing,react/jsx-closing-tag-location */
import React, { PureComponent } from 'react';
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker } from 'antd';

const { Option } = Select;
class DrawerForm extends PureComponent {

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, onClose } = this.props;
    // console.info(111);
    return <Drawer
      title="预约会议"
      width={720}
      onClose={onClose}
      visible={visible}
      style={{
        overflow: 'auto',
        height: 'calc(100% - 108px)',
        paddingBottom: '108px',
      }}
      destroyOnClose={false}
    >
      <Form layout="vertical" hideRequiredMark>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Name">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please enter user name' }],
              })(<Input placeholder="Please enter user name" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Url">
              {getFieldDecorator('url', {
                rules: [{ required: true, message: 'Please enter url' }],
              })(
                <Input
                  style={{ width: '100%' }}
                  addonBefore="http://"
                  addonAfter=".com"
                  placeholder="Please enter url"
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Owner">
              {getFieldDecorator('owner', {
                rules: [{ required: true, message: 'Please select an owner' }],
              })(
                <Select placeholder="Please select an owner">
                  <Option value="xiao">Xiaoxiao Fu</Option>
                  <Option value="mao">Maomao Zhou</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Type">
              {getFieldDecorator('type', {
                rules: [{ required: true, message: 'Please choose the type' }],
              })(
                <Select placeholder="Please choose the type">
                  <Option value="private">Private</Option>
                  <Option value="public">Public</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Approver">
              {getFieldDecorator('approver', {
                rules: [
                  {
                    required: true,
                    message: 'Please choose the approver',
                  }],
              })(
                <Select placeholder="Please choose the approver">
                  <Option value="jack">Jack Ma</Option>
                  <Option value="tom">Tom Liu</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="DateTime">
              {getFieldDecorator('dateTime', {
                rules: [
                  {
                    required: true,
                    message: 'Please choose the dateTime',
                  }],
              })(
                <DatePicker.RangePicker
                  style={{ width: '100%' }}
                  getPopupContainer={trigger => trigger.parentNode}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Description">
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: 'please enter url description',
                  },
                ],
              })(
                <Input.TextArea rows={4} placeholder="please enter url description" />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={onClose} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button onClick={onClose} type="primary">
          Submit
        </Button>
      </div>
    </Drawer>
  }
}
const MeetDrawer = Form.create()(DrawerForm);
export default MeetDrawer;
