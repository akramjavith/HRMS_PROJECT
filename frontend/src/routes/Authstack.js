import { Routes, Route } from "react-router-dom";

import Signin from "../login/Signin";
import TwoFA from "../login/TwoFA";
import EmailVerify from '../login/EmailVerify'

function Authstack() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Signin />} />
                <Route path="signin" element={<Signin />} />
                <Route path="/twofactorauthentication" element={<TwoFA />} />
                <Route path="/email/:id/verify/:token" element={<EmailVerify />} />
            </Routes>
        </>
    );
}
export default Authstack;
