import cls from "./Spinner.module.css"

const Spinner: React.FC = () => (
  <div className={cls.spinner} role="alert" aria-busy="true">
    <div className={cls.bounce1}></div>
    <div className={cls.bounce2}></div>
    <div className={cls.bounce3}></div>
  </div>
)

export default Spinner
