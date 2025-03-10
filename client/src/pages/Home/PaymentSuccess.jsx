import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    
    const txnid = searchParams.get("txnid");
    const status = searchParams.get("status");
    const amount = searchParams.get("amount");

    useEffect(() => {
        console.log("Transaction ID:", txnid);
        console.log("Status:", status);
        console.log("Amount:", amount);
    }, [txnid, status, amount]);

    return (
        <div>
            <h2>Payment Successful 🎉</h2>
            <p>Transaction ID: {txnid}</p>
            <p>Status: {status}</p>
            <p>Amount: ₹{amount}</p>
        </div>
    );
}

export default PaymentSuccess;
