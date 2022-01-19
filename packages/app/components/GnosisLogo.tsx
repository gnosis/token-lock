import Image from "next/image"
import cls from "./GnosisLogo.module.css"

const GnosisLogo: React.FC = () => (
  <div className={cls.container}>
    <a href="/">
      <Image 
        className={cls.logo}
        src="/gno.svg"
        alt="Gnosis Logo"
        height={36}
        width={36}
      />
    </a>
  </div>
)

export default GnosisLogo
