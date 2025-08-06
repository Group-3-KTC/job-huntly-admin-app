import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  WarningCircle,
  Buildings,
  Gear,
  Flag,
  Lock,
  Handshake,
  CreditCard,
  Chats,
  ChartBar,
  Bell,
  Info,
  Pulse,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { type JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
  Notification,
  NotificationType,
} from "../../types/notification.type.ts";

const notifications: Notification[] = [
  {
    id: 1,
    type: "report",
    message: "User *john.doe* reported a job post",
    time: "5m ago",
    link: "/listReport",
  },
  {
    id: 2,
    type: "company",
    message: "New company *ABC Tech* joined the platform",
    time: "30m ago",
    link: "/companyList",
  },
  {
    id: 3,
    type: "system",
    message: "System update scheduled at 10 PM",
    time: "1h ago",
    link: "/",
  },
  {
    id: 4,
    type: "other",
    message: "A new notification has arrived",
    time: "2h ago",
    link: "/",
  },
  {
    id: 5,
    type: "weekly_summary",
    message: "Weekly summary is available",
    time: "3h ago",
    link: "/",
  },
  {
    id: 6,
    type: "payment_issue",
    message: "Payment failed for Recruiter X",
    time: "5h ago",
    link: "/",
  },
];

// --- Icon & Color metadata ---
const typeMeta: Record<
  NotificationType,
  { icon: JSX.Element; bgColor: string }
> = {
  report: {
    icon: <WarningCircle className="text-white w-5 h-5" />,
    bgColor: "bg-red-500",
  },
  system: {
    icon: <Gear className="text-white w-5 h-5" />,
    bgColor: "bg-blue-500",
  },
  company: {
    icon: <Buildings className="text-white w-5 h-5" />,
    bgColor: "bg-green-500",
  },
  job_post_flagged: {
    icon: <Flag className="text-white w-5 h-5" />,
    bgColor: "bg-yellow-500",
  },
  account_locked: {
    icon: <Lock className="text-white w-5 h-5" />,
    bgColor: "bg-gray-500",
  },
  recruiter_request: {
    icon: <Handshake className="text-white w-5 h-5" />,
    bgColor: "bg-indigo-500",
  },
  high_activity: {
    icon: <Pulse className="text-white w-5 h-5" />,
    bgColor: "bg-orange-500",
  },
  payment_issue: {
    icon: <CreditCard className="text-white w-5 h-5" />,
    bgColor: "bg-rose-500",
  },
  admin_mention: {
    icon: <Chats className="text-white w-5 h-5" />,
    bgColor: "bg-purple-500",
  },
  weekly_summary: {
    icon: <ChartBar className="text-white w-5 h-5" />,
    bgColor: "bg-sky-500",
  },
  other: {
    icon: <Info className="text-white w-5 h-5" />,
    bgColor: "bg-gray-400",
  },
};

const NotificationMenu = () => {
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  const [read, setRead] = useState(false);

  const visibleNotifications = showAll
    ? notifications
    : notifications.slice(0, 5);

  return (
    <Popover className="relative top-1 ">
      {({ open }) => (
        <>
          <PopoverButton className="cursor-pointer relative focus:outline-none">
            <Bell
              size={22}
              className={clsx("text-blue-500", open && "text-blue-700")}
            />
            {!read && notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </PopoverButton>

          <PopoverPanel
            anchor="bottom end"
            className=" absolute right-0 mt-2 w-80 rounded-xl bg-white shadow-2xl ring-1 ring-black/5 z-50"
          >
            <div className="p-3 font-semibold text-gray-900 border-b">
              Notifications
            </div>

            <ul
              className={clsx(
                "overflow-y-auto divide-y divide-gray-100",
                showAll ? "max-h-96" : "max-h-[340px] overflow-hidden",
              )}
            >
              {visibleNotifications.map((n) => {
                const { icon, bgColor } = typeMeta[n.type] ?? typeMeta.other;
                return (
                  <li
                    key={n.id}
                    onClick={() => navigate(n.link)}
                    className="flex gap-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer items-center"
                  >
                    <div
                      className={clsx(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        bgColor,
                      )}
                    >
                      {icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{n.message}</p>
                      <p className="text-xs text-gray-400">{n.time}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            {notifications.length > 5 && (
              <div className="text-center p-3 border-t border-gray-200">
                <button
                  onClick={() => setShowAll((prev) => !prev)}
                  className="text-sm text-blue-600 hover:underline cursor-pointer "
                >
                  {showAll ? "View less" : "View all notifications"}
                </button>
              </div>
            )}
            <div className="text-center p-2">
              <button
                onClick={() => setRead(true)}
                className="text-sm text-gray-600 hover:underline cursor-pointer"
              >
                Mark all as read
              </button>
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
};

export default NotificationMenu;
