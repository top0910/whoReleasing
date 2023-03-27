import { format } from 'date-fns';
//import ColumnFilter from './ColumnFilter';

export const PROJCOLUMNS = [
  {
    Header: 'Id',
    accessor: '_id',
  },
  {
    Header: 'name',
    accessor: 'name',
  },
  {
    Header: 'Public Mint',
    accessor: 'publicsale.date',
  },
  {
    Header: 'Status',
    accessor: 'saleStatusType',
  },
  {
    Header: 'Approved',
    accessor: 'approved',
  }
 
];

export const NEWSCOLUMNS = [
  {
    Header: 'Id',
    accessor: '_id',
  },
  {
    Header: 'title',
    accessor: 'title',
  },

  
];
