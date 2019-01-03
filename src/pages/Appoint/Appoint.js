/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Calendar,
  Badge,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import MeetDrawer from './MeetDrawer';

import styles from './appoint.less';

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()

class Appoint extends PureComponent {
  state = {
    isFlag : false
  };

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  };

  getListData = (value) => {
    let listData;
    switch (value.date()) {
      case 8:
        listData = [
          { type: 'warning', content: 'This is warning event.' },
          { type: 'success', content: 'This is usual event.' },
        ]; break;
      case 10:
        listData = [
          { type: 'warning', content: 'This is warning event.' },
          { type: 'success', content: 'This is usual event.' },
          { type: 'error', content: 'This is error event.' },
        ]; break;
      case 15:
        listData = [
          { type: 'warning', content: 'This is warning event' },
          { type: 'success', content: 'This is very long usual event。。....' },
          { type: 'error', content: 'This is error event 1.' },
          { type: 'error', content: 'This is error event 2.' },
          { type: 'error', content: 'This is error event 3.' },
          { type: 'error', content: 'This is error event 4.' },
        ]; break;
      default:
    }
    return listData || [];
  };

  dateCellRender = (value) => {
    const listData = this.getListData(value);
    return (
      <ul className="events">
        {
          listData.map(item => (
            <li key={item.content}>
              <Badge status={item.type} text={item.content} />
            </li>
          ))
        }
      </ul>
    )
  };

  getMonthData = (value) =>{
    if (value.month() === 8) {
      return 1394;
    }
  };

  onSelect = (value) =>{
    console.info(value.format('YYYY-MM-DD'),this.state.isFlag);
    this.setState({
      isFlag : true
    });

  };

  onClose = () => {
    this.setState({
      isFlag: false,
    });
  };

  monthCellRender = (value) => {
    const num = this.getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  render() {
    const { submitting } = this.props;

    const renderSelect ={
      dateCellRender : this.dateCellRender,
      monthCellRender : this.monthCellRender,
      onSelect : this.onSelect
    };

    const {isFlag} = this.state;

    return (
      <PageHeaderWrapper
        title="预约会议"
        content="选择想要预约的日期，点击，选择时间及地址，参会人员。"
      >
        <Card bordered={false}>
          <Calendar
            {...renderSelect}
          />
        </Card>
        {isFlag ? <MeetDrawer visible={isFlag} onClose={this.onClose} /> : null}
      </PageHeaderWrapper>
    );
  }
}

export default Appoint;
