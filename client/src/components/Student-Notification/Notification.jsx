import { useState, useEffect } from 'react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const server_url = import.meta.env.VITE_SERVER_URL;
  
  // Function to check if a notification is new (within last 24 hours)
  const isNewNotification = (sentAt) => {
    const notificationDate = new Date(sentAt);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return notificationDate > twentyFourHoursAgo;
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Get user ID from sessionStorage
        const userId = sessionStorage.getItem('userId');
        
        if (!userId) {
          throw new Error('User ID not found in session storage');
        }

        const response = await fetch(`${server_url}/notification/my-notifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: userId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setNotifications(data.data);
        } else {
          throw new Error('Failed to fetch notifications');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [server_url]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Notifications</h1>
          <p className="mt-2 text-sm text-gray-600">
            You have {notifications.length} notifications
          </p>
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No notifications found</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-6 rounded-lg shadow-sm border ${notification.isRead ? 'bg-white' : 'bg-blue-50 border-blue-200'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {notification.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.isRead && isNewNotification(notification.sentAt) && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      New
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <svg
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {new Date(notification.sentAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;