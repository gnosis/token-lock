import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useRef, useState } from "react";
import { useAccount } from "wagmi";
import Balance from "./Balance";
import Button from "./Button";
import Card from "./Card";
import Input from "./Input";
import Spinner from "./Spinner";
import { useTokenContractRead } from "./tokenContract";
import { useTokenLockContractWrite } from "./tokenLockContract";
import useTokenLockConfig from "./useTokenLockConfig";

const Withdraw: React.FC = () => {
  const [amount, setAmount] = useState(BigNumber.from(0));

  const { decimals, tokenSymbol } = useTokenLockConfig();
  const [{ data: accountData }] = useAccount();
  const [{ data: balanceOf }] = useTokenContractRead("balanceOf", {
    args: accountData?.address,
    skip: !accountData?.address,
  });
  const balance = balanceOf as undefined | BigNumber;

  const [status, withdraw] = useTokenLockContractWrite("withdraw");

  return (
    <Card>
      <Balance lockToken label="Locked Balance" />
      <Input
        type="number"
        unit="LGNO"
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
            Unlock Max
          </Button>
        }
      />
      <Button
        primary
        disabled={amount.isZero()}
        onClick={() => {
          withdraw({ args: [amount] });
        }}
      >
        Unlock {tokenSymbol}
        {status.loading && <Spinner />}
      </Button>
    </Card>
  );
};

export default Withdraw;
