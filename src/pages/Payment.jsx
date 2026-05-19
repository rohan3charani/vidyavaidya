import { useLocation, useNavigate } from "react-router-dom";
import PaymentModal from "./PaymentModal";

export default function Payment() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const amount = state?.amount ?? 0;
    const isMonthly = state?.isMonthly ?? false;
    const duration = state?.duration;
    const donationType = state?.donationType ?? "one-time";
    const category = state?.category ?? "Education";
    const donorDetails = state?.donorDetails;

    const handleClose = () => {
        navigate("/donate");
    };

    return (
        <PaymentModal
            amount={amount}
            isMonthly={isMonthly}
            duration={duration}
            donationType={donationType}
            category={category}
            donorDetails={donorDetails}
            onClose={handleClose}
        />
    );
}
