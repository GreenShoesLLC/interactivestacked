import React, { useEffect } from 'react';
import { Table, Tag, Checkbox } from 'antd';
import { useLazyQuery, useMutation } from '@apollo/client';

import { GET_TABLE_DATA } from 'store/actions/queries/workspace';
import { UPDATE_PORTFOLIOPROJECT_ISSELECTED } from 'store/actions/mutations/portfolioProject';
import { convertTableData } from 'common/utility';

const WorkspaceTable = ({ workspaceId, refetch }) => {
  const [getData, { data }] = useLazyQuery(GET_TABLE_DATA, {
    notifyOnNetworkStatusChange: true
  });
  const [IsSelectedProject] = useMutation(UPDATE_PORTFOLIOPROJECT_ISSELECTED, {
    notifyOnNetworkStatusChange: true,
  });

  const handleSelected = (Id) => {
    return async () => {
      await IsSelectedProject({variables: {Id}});
      refetch();
    }
  }

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
      render: (value, record) => <Tag color={value} style={{padding:10, border:`1px solid ${record.StrokeColor}`}}></Tag>
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
      render: (value, record) => <Checkbox defaultChecked={ value } onChange={handleSelected(record.key)}></Checkbox>
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