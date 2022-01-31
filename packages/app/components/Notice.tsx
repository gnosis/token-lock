import cls from "./Notice.module.css"

const Notice = () => (
  <div className={cls.container}>
    <div className={cls.noticeTitle}>
      There was an error. Please try again.
    </div>
    <div className={cls.errorText}>
      ERROR_INVALID_PARAMETER REG_MULTI_SZ: 5000-6000 PortsInternetAvailable: REG_SZ: Y UseInternetPorts: REG_SZ: Y
    </div>
  </div>
)

export default Notice
