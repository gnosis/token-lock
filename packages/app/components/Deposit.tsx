import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useMemo, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { CONTRACT_ADDRESSES } from "../config";
import Balance from "./Balance";
import Button from "./Button";
import Card from "./Card";
import Input from "./Input";
import Spinner from "./Spinner";
import { useTokenContractRead, useTokenContractWrite } from "./tokenContract";
import { useTokenLockContractWrite } from "./tokenLockContract";
import useChainId from "./useChainId";
import useTokenLockConfig from "./useTokenLockConfig";

const Deposit: React.FC = () => {
  const [amount, setAmount] = useState(BigNumber.from(0));

  const chainId = useChainId();
  const { decimals, tokenSymbol, tokenAddress } = useTokenLockConfig();
  const [{ data: accountData }] = useAccount();
  const [{ data: balanceOf }] = useTokenContractRead("balanceOf", {
    args: accountData?.address,
    skip: !accountData?.address,
  });
  const balance = balanceOf as undefined | BigNumber;

  const contractAddress = CONTRACT_ADDRESSES[chainId];
  const allowanceArgs = useMemo(
    () => [accountData?.address, contractAddress],
    [accountData?.address, contractAddress]
  );
  const [{ data: allowance }] = useTokenContractRead("allowance", {
    args: allowanceArgs,
    skip: !accountData?.address,
  });

  const [approveStatus, approve] = useTokenContractWrite("approve");
  const [depositStatus, deposit] = useTokenLockContractWrite("deposit");

  const needsAllowance = amount.gt(0) && allowance && allowance.lt(amount);

  return (
    <Card>
      <Balance label="Balance" />
      <Input
        type="number"
        unit="GNO"
        min={0}
        max={balance && formatUnits(balance, decimals)}
        value={formatUnits(amount, decimals)}
        onChange={(ev) => {
          setAmount(parseUnits(ev.target.value, decimals));
        }}
        meta={
          <Button
            link
            disabled={!balance || balance.isZero()}
            onClick={() => {
              if (balance) {
                setAmount(balance);
              }
            }}
          >
            Lock Max
          </Button>
        }
      />
      {needsAllowance && (
        <Button
          primary
          disabled={amount.isZero() || approveStatus.loading}
          onClick={() => {
            approve({ args: [contractAddress, amount] });
          }}
        >
          Allow locking contract to use your {tokenSymbol}
          {approveStatus.loading && <Spinner />}
        </Button>
      )}
      {
        <Button
          primary={!needsAllowance}
          disabled={needsAllowance || amount.isZero() || depositStatus.loading}
          onClick={() => {
            approve({ args: [amount] });
          }}
        >
          Lock {tokenSymbol}
          {depositStatus.loading && <Spinner />}
        </Button>
      }
    </Card>
  );
};

export default Deposit;
