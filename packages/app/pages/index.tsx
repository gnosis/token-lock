import type { NextPage } from "next"
import ReactModal from "react-modal"
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
import { useEffect } from "react"
import { useNetwork } from "wagmi"

const isProd =
  typeof window !== "undefined" && window.location.hostname === "lock.gnosis.io"

const Home: NextPage = () => {
  useEffect(() => {
    ReactModal.setAppElement("#root")
  }, [])
  const config = useTokenLockConfig()
  const [{ data: network }] = useNetwork()

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
          <a
            href="https://discord.gg/2jnnJx3Y"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/discord.svg"
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
              src="/twitter.svg"
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
      </footer>
    </div>
  )
}

export default Home
