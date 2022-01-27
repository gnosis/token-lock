import { Chain, Connector, normalizeChainId } from "wagmi"
import SafeAppsSDK, { SafeInfo } from "@gnosis.pm/safe-apps-sdk"
import { SafeAppProvider } from "@gnosis.pm/safe-apps-provider"
import { providers } from "ethers"

let sdk: SafeAppsSDK | undefined
let safe: SafeInfo | undefined
export let safePromise: Promise<SafeInfo | undefined>

const inIframe = () => {
  if (typeof window === "undefined") return false
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

const tryToGetSafeInfo = async () => {
  if (!inIframe()) {
    safePromise = Promise.resolve(undefined)
    return
  }

  sdk = new SafeAppsSDK()
  safePromise = Promise.race([
    sdk.safe.getInfo(),
    // Timeout needed as the returned promise won't resolve if we're not in a Gnosis Safe context
    new Promise<undefined>((resolve) => setTimeout(resolve, 100)),
  ])
  safe = await safePromise
}
tryToGetSafeInfo()

class GnosisSafeConnector extends Connector {
  readonly id = "gnosisSafe"
  readonly name = "Gnosis Safe"
  ready = !!sdk

  private _provider?: providers.Web3Provider

  constructor(config: { chains?: Chain[] }) {
    super({ ...config, options: {} })
  }

  private getSafe() {
    if (!safe) {
      throw new Error("Not in a Gnosis Safe context")
    }

    return safe
  }

  private getSdk() {
    if (!sdk) {
      throw new Error("Not in a Gnosis Safe context")
    }

    return sdk
  }

  getProvider() {
    if (!this._provider) {
      this._provider = new providers.Web3Provider(
        new SafeAppProvider(this.getSafe(), this.getSdk())
      )
    }
    return this._provider
  }

  async connect() {
    await safePromise

    const provider = this.getProvider()
    provider.on("accountsChanged", this.onAccountsChanged)
    provider.on("chainChanged", this.onChainChanged)
    provider.on("disconnect", this.onDisconnect)

    const id = this.getSafe().chainId
    const unsupported = this.isChainUnsupported(id)
    return {
      account: this.getSafe().safeAddress,
      chain: { id, unsupported },
      provider: provider,
    }
  }

  async disconnect() {
    return
  }

  async getAccount() {
    return this.getSafe().safeAddress
  }

  async getChainId() {
    return this.getSafe().chainId
  }

  async getSigner() {
    return this.getProvider().getSigner(this.getSafe().safeAddress)
  }

  async isAuthorized() {
    await safePromise

    return !!safe
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) this.emit("disconnect")
    else this.emit("change", { account: accounts[0] })
  }

  protected onChainChanged = (chainId: number | string) => {
    const id = normalizeChainId(chainId)
    const unsupported = this.isChainUnsupported(id)
    this.emit("change", { chain: { id, unsupported } })
  }

  protected onDisconnect = () => {
    this.emit("disconnect")
  }
}

export default GnosisSafeConnector
