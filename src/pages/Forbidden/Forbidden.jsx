import { Button, Result } from "antd";
import { Link } from "react-router-dom";
const Forbidden = () => (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to={"/"}>Back to login</Link>
      </Button>
    }
  />
);
export default Forbidden;
