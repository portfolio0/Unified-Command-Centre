import { BrowserRouter, Routes, Route } from "react-router-dom";
import Mainlayout from "./layouts/Mainlayout";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Templates from "./pages/Templates";
import Workflows from "./pages/Workflows";
import Conversations from "./pages/Conversations";
import Sendnotification from "./pages/Sendnotifications";
import Workflowinstances from "./pages/Workflowinstance";
import Makepayment from "./pages/Makepayment";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Mainlayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="templates" element={<Templates />} />
          <Route path="workflows" element={<Workflows />} />
          <Route path="conversations" element={<Conversations />} />
          <Route path="send" element={<Sendnotification />} />
          <Route path="/workflow-instances" element={<Workflowinstances />} />
          <Route path="/make-payment" element={<Makepayment />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
