import { useState } from 'react';
import type { Address } from 'viem';
import { base } from 'viem/chains';
import { useValue } from '../../core-react/internal/hooks/useValue';
import type { Token } from '../../token';
import type { SwapLiteTokens } from '../types';
import { useSwapBalances } from './useSwapBalances';
import { useSwapLiteToken } from './useSwapLiteToken';

const ethToken: Token = {
  name: 'ETH',
  address: '',
  symbol: 'ETH',
  decimals: 18,
  image:
    'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
  chainId: base.id,
};

const usdcToken: Token = {
  name: 'USDC',
  address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  symbol: 'USDC',
  decimals: 6,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
  chainId: base.id,
};

export const useSwapLiteTokens = (
  toToken: Token,
  fromToken?: Token,
  address?: Address,
): SwapLiteTokens => {
  const fromETH = useSwapLiteToken(toToken, ethToken, address);
  const fromUSDC = useSwapLiteToken(toToken, usdcToken, address);
  const from = useSwapLiteToken(toToken, fromToken, address);

  const [toAmount, setToAmount] = useState('');
  const [toAmountUSD, setToAmountUSD] = useState('');
  const [toLoading, setToLoading] = useState(false);

  // If the toToken is ETH, use USDC for swapQuote
  const token = toToken?.symbol === 'ETH' ? usdcToken : ethToken;

  const {
    toBalanceString: balance,
    toTokenBalanceError: error,
    toTokenResponse: balanceResponse,
  } = useSwapBalances({ address, fromToken: token, toToken });

  const to = useValue({
    balance,
    balanceResponse,
    amount: toAmount,
    setAmount: setToAmount,
    amountUSD: toAmountUSD,
    setAmountUSD: setToAmountUSD,
    token: toToken,
    loading: toLoading,
    setLoading: setToLoading,
    error,
  });

  return { fromETH, fromUSDC, from, to };
};
