import cls from "./IconButton.module.css"

interface Props {
  onClick?(): void
  icon: string
  title: string
}

const IconButton: React.FC<Props> = ({ onClick, icon, title }) => (
  <button className={cls.button} onClick={onClick} title={title}>
    <img src={`/${icon}.svg`} alt={title} width={16} height={16} />
  </button>
)

type LinkProps = Props & {
  href: string
  external: boolean
}

export const IconLinkButton: React.FC<LinkProps> = ({
  href,
  onClick,
  icon,
  title,
  external,
}) => (
  <a
    className={cls.button}
    href={href}
    onClick={onClick}
    title={title}
    {...(external ? { rel: "external noreferrer", target: "_blank" } : {})}
  >
    <img src={`/${icon}.svg`} alt={title} width={16} height={16} />
  </a>
)

export default IconButton
