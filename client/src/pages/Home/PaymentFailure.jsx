import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Result } from "antd";

function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const txnid = searchParams.get("txnid");

  return (
    <Result
      status="error"
      title="Payment Failed"
      subTitle={txnid ? `Transaction ID: ${txnid}` : "Something went wrong with your payment."}
      extra={[
        <Button type="primary" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      ]}
    />
  );
}

export default PaymentFailure;
