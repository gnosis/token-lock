import { useConnect } from "wagmi";
import Modal from "react-modal";
import cls from "./Modal.module.css";

interface Props {
  onRequestClose(): void;
}
const ConnectModal: React.FC<Props> = ({ onRequestClose }) => {
  const [{ data, error }, connect] = useConnect();

  return (
    <Modal isOpen onRequestClose={onRequestClose} className={cls.container}>
      {data.connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={async () => {
            const result = await connect(connector);
            if (result?.data?.account) {
              onRequestClose();
            }
          }}
        >
          {connector.name}
          {!connector.ready && " (unsupported)"}
        </button>
      ))}

      {error && <div>{error?.message ?? "Failed to connect"}</div>}
    </Modal>
  );
};

export default ConnectModal;
