import type { NextPage } from "next"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import { CHAINS } from "../config"
import {
  Connect,
  ConnectHint,
  GnosisLogo,
  LockedGnoLogo,
  LockedBalance,
  useTokenLockConfig,
  Withdraw,
  DepositAndWithdraw,
  StatsDeposit,
  StatsLocked,
  StatsWithdraw,
} from "../components"
import { useNetwork } from "wagmi"
import UseGNOBanner from "../components/UseGnoBanner"

const isProd =
  typeof window !== "undefined" && window.location.hostname === "lock.gnosis.io"

const Home: NextPage = () => {
  const config = useTokenLockConfig()
  const network = useNetwork()

  const connectedChainId = network.chain?.id
  const connected =
    connectedChainId && CHAINS.some(({ id }) => id === connectedChainId)

  const depositPeriodOngoing = config.depositDeadline.getTime() > Date.now()
  const lockPeriodOngoing =
    config.depositDeadline.getTime() < Date.now() &&
    config.depositDeadline.getTime() + config.lockDuration > Date.now()
  const lockPeriodOver =
    config.depositDeadline.getTime() + config.lockDuration < Date.now()

  return (
    <div className={styles.container} id="root">
      <Head>
        <title>Lock GNO</title>
        <meta
          name="description"
          content="Qualify for a $COW airdrop boost by locking your GNO for 12 months"
        />
        {!isProd && <meta name="robots" content="noindex" />}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <GnosisLogo />
        <LockedGnoLogo locked={lockPeriodOngoing} />
        <Connect />
      </header>

      <main className={styles.main}>
        <UseGNOBanner />
        {depositPeriodOngoing && (
          <>
            <StatsDeposit />
            {connected && <DepositAndWithdraw />}
          </>
        )}

        {lockPeriodOngoing && (
          <>
            <StatsLocked />
            {connected && <LockedBalance />}
          </>
        )}

        {lockPeriodOver && (
          <>
            <StatsWithdraw />
            {connected && <Withdraw />}
          </>
        )}

        {!connected && <ConnectHint />}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.left}>
            <span>LGNO contract: </span>
            {connectedChainId === 100 ? (
              <a
                href="https://blockscout.com/xdai/mainnet/address/0xd4Ca39f78Bf14BfaB75226AC833b1858dB16f9a1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/etherscan.svg"
                  alt="View contract on Gnosis Chain Blockscout"
                  width={16}
                  height={16}
                />
              </a>
            ) : (
              <a
                href="https://etherscan.io/address/0x4f8AD938eBA0CD19155a835f617317a6E788c868"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/etherscan.svg"
                  alt="View contract on Etherscan"
                  width={16}
                  height={16}
                />
              </a>
            )}

            <a
              href="https://github.com/gnosis/token-lock/blob/master/packages/contracts/contracts/TokenLock.sol"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/github.png"
                alt="View contract source code on GitHub"
                width={16}
                height={16}
              />
            </a>
          </div>
          <div className={styles.right}>
            <a
              href="https://discord.com/invite/gnosischain"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/discordicon.svg"
                alt="Gnosis Guild Discord"
                width={16}
                height={16}
              />
            </a>
            <a
              href="https://twitter.com/gnosisguild"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/twittericon.svg"
                alt="Gnosis Guild Twitter"
                width={16}
                height={16}
              />
            </a>

            <div className={styles.divider} />

            <a
              className={styles.gg}
              href="https://gnosisguild.mirror.xyz"
              target="_blank"
              rel="noopener noreferrer"
            >
              Built by Gnosis Guild{" "}
              <span className={styles.logo}>
                <img
                  src="/gnosisguild.png"
                  alt="Gnosis Guild"
                  width={32}
                  height={32}
                />
              </span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
