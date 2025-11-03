import React from "react";
import {
  Home,
  User,
  BookOpen,
  Trophy,
  TrendingUp,
  Settings,
  Bell,
  HelpCircle,
  ShoppingBag,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = ({
  collapsed = false,
  onToggleSidebar,
  activeTab = "home",
  onTabChange,
  userSettings = {},
}) => {
  const navigationItems = [
    { icon: Home, label: "Dashboard", tab: "home" },
    { icon: BookOpen, label: "My Learning", tab: "explore" },
    { icon: ShoppingBag, label: "Marketplace", tab: "marketplace" },
    { icon: Trophy, label: "Achievements", tab: "certificates" },
    { icon: TrendingUp, label: "Progress", tab: "progress" },
    { icon: Bell, label: "Notifications", tab: "notifications" },
    { icon: Settings, label: "Settings", tab: "settings" },
    { icon: HelpCircle, label: "Help & Support", tab: "help" },
  ];

  const handleNavClick = (tab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div
        className="user-profile"
        onClick={onToggleSidebar}
        role="button"
        aria-label="Toggle sidebar"
      >
        <div className="profile-picture">
          {userSettings.profilePhoto ? (
            <img
              src={userSettings.profilePhoto}
              alt="Profile"
              className="profile-photo-img"
            />
          ) : (
            <User size={24} />
          )}
        </div>
        <div className="user-info">
          <h3 className="user-name">
            {userSettings.displayName || "Vaishnavi"}
          </h3>
          <p className="user-details">
            Roll No: {userSettings.rollNo || "23CS101"}
          </p>
          <p className="user-details">
            Section: {userSettings.section || "CSE-A"}
          </p>
          <p className="user-details">Student | PSIT</p>
        </div>
      </div>

      <nav className="navigation">
        {navigationItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className={`nav-item ${activeTab === item.tab ? "active" : ""}`}
              onClick={() => handleNavClick(item.tab)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleNavClick(item.tab);
                }
              }}
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
