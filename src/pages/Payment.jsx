import { useLocation, useNavigate } from "react-router-dom";
import PaymentModal from "./PaymentModal";

export default function Payment() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const amount = state?.amount ?? 0;
    const isMonthly = state?.isMonthly ?? false;

    const handleClose = () => {
        navigate("/donate");
    };

    return (
        <PaymentModal
            amount={amount}
            isMonthly={isMonthly}
            onClose={handleClose}
        />
    );
}
