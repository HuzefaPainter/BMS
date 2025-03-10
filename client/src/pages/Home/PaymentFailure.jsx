import { useSearchParams } from "react-router-dom";

function PaymentFailure() {
    const [searchParams] = useSearchParams();
    
    const txnid = searchParams.get("txnid");
    const status = searchParams.get("status");

    return (
        <div>
            <h2>Payment Failed ❌</h2>
            <p>Transaction ID: {txnid}</p>
            <p>Status: {status}</p>
            <p>Please try again.</p>
        </div>
    );
}

export default PaymentFailure;
