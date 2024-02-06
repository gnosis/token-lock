import Card from "../Card"

import classes from "./UseGnoBanner.module.css"

const UseGNOBanner = () => {
  return (
    <a href="https://ecosystem.gnosischain.com/" className={classes.cardLink}>
      <Card className={classes.card}>
        <img src="/gnochainfuture.png" alt="an imagined solarpunk future" />
        <h2>Not sure where to use your GNO?</h2>
        <p>
          Click here to explore all the valuable uses on Gnosis Chain and
          Ethereum
        </p>
      </Card>
    </a>
  )
}

export default UseGNOBanner
