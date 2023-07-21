import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ThemeProvider } from '@mui/material';
import { LightTheme, maxWidthSx } from '@/theme/theme';
import styles from './index.less';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Search from 'antd/es/input/Search';
import { Card, Empty } from 'antd';
import { Link, useHistory, useParams } from 'umi';
import { Footer } from '@/components/footer';
import { BalanceChange } from '@/components/balanceChange';
import { Header } from '@/components/header';

export default function BalancePage() {
    const history = useHistory()
  const [balances, __balances] = useState<{ tick: string; balance: string }[]>([]);
  const { address } = useParams<{ address?: string }>();

  const [searchAddress, __searchAddress] = useState('')
  useEffect(() => {
    axios.get(`/api/terc_balances?addr=${searchAddress || address}`).then(res => {
        __balances(res?.data?.data ?? [])
    })
  }, [address, searchAddress])

  const [tick_index, __tick_index] = useState(0)
  const tick = balances[tick_index]?.tick
  return (
    <ThemeProvider theme={LightTheme}>
      <Header />
      <Box
        sx={{
          ...maxWidthSx,
          p: '20px',
        }}
      >
        <Box
          textAlign={'center'}
          sx={{
            mt: '40px',
            mb: '20px',
          }}
        >
          <Typography sx={{ fontSize: '20px', mb: '20px' }}>
            Check out IERC-20 balance of the address.
          </Typography>
          <form>
            <Search
              placeholder="input search address"
              allowClear
              defaultValue={address}
              autoComplete={"on"}
              onSearch={(value) => {
                console.log('value', value);
                if(value[0] === '0' && value[1] === 'x'){
                  __searchAddress(value)
                }
              }}
              enterButton
              style={{ maxWidth: 604 }}
            />
          </form>
        </Box>
        <Card style={{ marginTop: '40px' }}>
          {(balances && balances.length > 0 ? balances : [{
            tick: 'ethi',
            balance: '0.0000',
          }]).map((balance, index) => <Card key={JSON.stringify(balance)} title={balance.tick} style={{ 
            width: 300, display: 'inline-block', marginRight: '20px', cursor: 'pointer',
            borderWidth: index === tick_index ? '6px' : '1px'
          }} onClick={() => __tick_index(index)}>
            <Typography>Balance: {balance.balance}</Typography>
          </Card>)}
        </Card>
        <Card style={{ marginTop: '40px' }}>
          <Box sx={{ mt: '40px' }}>
            <BalanceChange tick={tick} address={searchAddress || address || ''} />
          </Box>
          {/* <Box sx={{ mt: '40px' }}>
            <Link to={`/send_list/${searchAddress || address}`}>query links all relevant data</Link>
          </Box> */}
          </Card>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

declare global {
  interface Window {
    ethereum: any;
  }
}
