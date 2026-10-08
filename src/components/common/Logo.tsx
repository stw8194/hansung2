import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link className="app-logo" to="/" aria-label="MAN-PICK 홈">
      <span className="brand-mark"><img src="/man-pick-logo.png" alt="MAN-PICK" width="1024" height="662" /></span>
      <small>남성 전문 뷰티</small>
    </Link>
  );
}
