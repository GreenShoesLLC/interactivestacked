import React, { useEffect } from 'react';
import { Table, Tag, Checkbox } from 'antd';
import { useLazyQuery } from '@apollo/client';

import { GET_TABLE_DATA } from 'store/actions/queries/workspace';
import { convertTableData } from 'common/utility';

const WorkspaceTable = ({ workspaceId }) => {
  const [getData, { data }] = useLazyQuery(GET_TABLE_DATA, {
    notifyOnNetworkStatusChange: true
  });

  useEffect(() => {
    if(workspaceId) {
      getData({variables: {workspaceId: workspaceId}});
    }
  }, [workspaceId]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
      onCell: (record) => {
        if(record.child) {
          return {
            rowSpan: record.child
          }
        }
        if(record.double) {
          return {
            rowSpan: 0
          }
        }
      }
    },
    {
      title: 'Color',
      dataIndex: 'Color',
      key: 'Color',
      width: '5%',
      align: 'center',
      onCell: (record) => {
        if(record.child) {
          return {
            rowSpan: record.child
          }
        }
        if(record.double) {
          return {
            rowSpan: 0
          }
        }
      },
      render: (value) => <Tag color={value} style={{padding:10}}></Tag>
    },
    {
      title: 'BaselineStartDate',
      dataIndex: 'BaselineStartDate',
      key: 'BaselineStartDate',
      align: 'center',
      onCell: (record) => {
        if(record.child) {
          return {
            rowSpan: record.child
          }
        }
        if(record.double) {
          return {
            rowSpan: 0
          }
        }
      }
    },
    {
      title: 'AdjustedStartDate',
      dataIndex: 'AdjustedStartDate',
      key: 'AdjustedStartDate',
      align: 'center'
    },
    {
      title: 'BaselinePriority',
      dataIndex: 'BaselinePriority',
      key: 'BaselinePriority',
      onCell: (record) => {
        if(record.child) {
          return {
            rowSpan: record.child
          }
        }
        if(record.double) {
          return {
            rowSpan: 0
          }
        }
      }
    },
    {
      title: 'AdjustedPriority',
      dataIndex: 'AdjustedPriority',
      key: 'AdjustedPriority'
    },
    {
      title: 'IsSelected',
      dataIndex: 'IsSelected',
      key: 'IsSelected',
      render: (value) => <Checkbox defaultChecked={ value } onChange={(e) =>{}}></Checkbox>
    },
    {
      title: 'Tags',
      dataIndex: 'Tags',
      key: 'Tags'
    }
  ]

  return (
    <Table 
      columns={columns} 
      dataSource={convertTableData(data)} 
      scroll={{
        y: 260,
      }}
      bordered={true}
      pagination={false}
      size="small"
      style={{width:'90vw', marginLeft: '4vw'}}/>
  )
}

export default WorkspaceTable;