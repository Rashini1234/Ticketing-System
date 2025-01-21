import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VendorDashboard from "./pages/VendorDashboard";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import MyEvents from "./pages/MyEvents";
import TicketsSold from "./pages/TicketsSold";
import CustomerDashboard from "./pages/CustomerDashboard";
import Events from "./pages/Events";
import MyTickets from "./pages/MyTickets";
import PrivateRoute from "./components/PrivateRoute"; // Import the PrivateRoute component

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Vendor Routes (Protected) */}
        <Route
          path="/dashboard/vendor"
          element={
            <PrivateRoute role="VENDOR">
              <VendorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/vendor/create-event"
          element={
            <PrivateRoute role="VENDOR">
              <CreateEvent />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/vendor/event-details/:id"
          element={
            <PrivateRoute role="VENDOR">
              <EventDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/vendor/my-events"
          element={
            <PrivateRoute role="VENDOR">
              <MyEvents />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/vendor/tickets-sold"
          element={
            <PrivateRoute role="VENDOR">
              <TicketsSold />
            </PrivateRoute>
          }
        />

        {/* Customer Routes (Protected) */}
        <Route
          path="/dashboard/customer"
          element={
            <PrivateRoute role="CUSTOMER">
              <CustomerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/customer/events"
          element={
            <PrivateRoute role="CUSTOMER">
              <Events />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/customer/my-tickets"
          element={
            <PrivateRoute role="CUSTOMER">
              <MyTickets />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
