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
        // By using navigate(-1), we pop '/payment' off the history stack.
        // This drops the user back onto the exact '/donate' history entry.
        // If they click the browser back button from there, they will correctly go Home!
        navigate(-1);
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
