import React from "react";
import {
  Home,
  Search,
  Brain,
  Clock,
  MessageCircle,
  Mic,
  ShoppingCart,
  Edit3,
  LogIn,
  Star,
  User,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = ({ collapsed = false, onToggleSidebar }) => {
  const navigationItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: Search, label: "Explore" },
    { icon: Brain, label: "Problems" },
    { icon: Clock, label: "Contest" },
    { icon: MessageCircle, label: "Discuss" },
    { icon: Mic, label: "Interview" },
    { icon: ShoppingCart, label: "Store" },
    { icon: Edit3, label: "Register" },
    { icon: LogIn, label: "Log in" },
    { icon: Star, label: "Premium" },
  ];

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div
        className="user-profile"
        onClick={onToggleSidebar}
        role="button"
        aria-label="Toggle sidebar"
      >
        <div className="profile-picture">
          <User size={24} />
        </div>
        <div className="user-info">
          <h3 className="user-name">Vaishnavi</h3>
          <p className="user-details">Roll No: 23CS101</p>
          <p className="user-details">Section: CSE-A</p>
          <p className="user-details">Student | PSIT</p>
        </div>
      </div>

      <nav className="navigation">
        {navigationItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className={`nav-item ${item.active ? "active" : ""}`}
            >
              <IconComponent size={20} />
              <span className="nav-label">{item.label}</span>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
