import IconButton from "./IconButton"
import cls from "./Notice.module.css"

const Notice: React.FC<{ onDismiss: () => void }> = ({
  children,
  onDismiss,
}) => (
  <div className={cls.container}>
    <div className={cls.close}>
      <IconButton icon="close" onClick={onDismiss} title="Hide message" />
    </div>
    <div className={cls.noticeTitle}>There was an error. Please try again.</div>
    <div className={cls.errorText}>{children}</div>
  </div>
)

export default Notice
