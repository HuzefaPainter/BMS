import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Result } from "antd";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const txnid = searchParams.get("txnid");
  const amount = searchParams.get("amount");

  return (
    <Result
      status="success"
      title="Payment Successful!"
      subTitle={
        <div>
          <p>Transaction ID: {txnid}</p>
          <p>Amount Paid: ₹{amount}</p>
        </div>
      }
      extra={[
        <Button type="primary" onClick={() => navigate("/")}>
          Back to Home
        </Button>,
        <Button onClick={() => navigate("/profile")}>
          View My Bookings
        </Button>
      ]}
    />
  );
}

export default PaymentSuccess;
