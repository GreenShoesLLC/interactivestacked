import React, { useEffect } from 'react';
import { Table, Tag, Checkbox } from 'antd';
import { useLazyQuery, useMutation } from '@apollo/client';

import { GET_TABLE_DATA } from 'store/actions/queries/portfolio';
import { UPDATE_PORTFOLIOPROJECT_ISSELECTED } from 'store/actions/mutations/portfolioProject';
import { convertTableData } from 'common/utility';

const WorkspaceTable = ({ portfolioId, state, refetch }) => {
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
    if(portfolioId) {
      getData({variables: {portfolioId: portfolioId}});
    }
  }, [portfolioId, state]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name'
    },
    {
      title: 'Color',
      dataIndex: 'Color',
      key: 'Color',
      width: '5%',
      align: 'center',
      render: (value, record) => <Tag color={value} style={{padding:10, border:`1px solid ${record.StrokeColor}`}}></Tag>
    },
    {
      title: 'BaselineStartDate',
      dataIndex: 'BaselineStartDate',
      key: 'BaselineStartDate',
      align: 'center'
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
      render: (value, record) => <Checkbox defaultChecked={ value } onChange={handleSelected(record.Id)}></Checkbox>
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