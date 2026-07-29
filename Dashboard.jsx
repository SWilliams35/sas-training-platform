import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard({ user, token, onLogout }) {
  const [modules, setModules] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
    fetchUserProgress();
    if (user?.is_admin) {
      fetchAllUsers();
    }
  }, [token, user]);

  const fetchModules = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/modules`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setModules(data);
      }
    } catch (err) {
      console.error('Error fetching modules:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/progress/user/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        const progressMap = {};
        data.forEach(item => {
          progressMap[item.module_id] = item;
        });
        setUserProgress(progressMap);
      }
    } catch (err) {
      console.error('Error fetching progress:', err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/progress`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data);
      }
    } catch (err) {
      console.error('Error fetching all users:', err);
    }
  };

  const updateProgress = async (moduleId, newStatus) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/progress/update`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            module_id: moduleId,
            status: newStatus,
            progress_percentage: newStatus === 'Completed' ? 100 : 50
          })
        }
      );
      if (response.ok) {
        fetchUserProgress();
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const getStats = () => {
    const completed = Object.values(userProgress).filter(p => p.status === 'Completed').length;
    const inProgress = Object.values(userProgress).filter(p => p.status === 'In Progress').length;
    const notStarted = modules.length - completed - inProgress;
    return { completed, inProgress, notStarted };
  };

  const stats = getStats();
  const groupedModules = {};
  modules.forEach(m => {
    if (!groupedModules[m.category]) groupedModules[m.category] = [];
    groupedModules[m.category].push(m);
  });

  if (loading) return <div className="loading">Loading modules...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>SA Team Training Platform</h1>
        <div className="header-right">
          <span>{user.email}</span>
          {user.is_admin && (
            <button
              className="btn-admin"
              onClick={() => setShowAllUsers(!showAllUsers)}
            >
              {showAllUsers ? 'My Progress' : 'All Users'}
            </button>
          )}
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {!showAllUsers ? (
        <div className="dashboard-content">
          <div className="stats">
            <div className="stat-card completed">
              <h3>{stats.completed}</h3>
              <p>Completed</p>
            </div>
            <div className="stat-card in-progress">
              <h3>{stats.inProgress}</h3>
              <p>In Progress</p>
            </div>
            <div className="stat-card not-started">
              <h3>{stats.notStarted}</h3>
              <p>Not Started</p>
            </div>
          </div>

          {Object.entries(groupedModules).map(([category, cats]) => (
            <div key={category} className="category">
              <h2>{category} ({cats.length})</h2>
              <div className="modules-grid">
                {cats.map(module => {
                  const progress = userProgress[module.id];
                  const status = progress?.status || 'Not Started';
                  return (
                    <div
                      key={module.id}
                      className={`module-card ${status.toLowerCase().replace(' ', '-')}`}
                    >
                      <h3>{module.module_id}</h3>
                      <p>{module.title}</p>
                      <div className="status-badge">{status}</div>
                      <div className="module-buttons">
                        {status !== 'In Progress' && (
                          <button
                            className="btn-small"
                            onClick={() => updateProgress(module.id, 'In Progress')}
                          >
                            Start
                          </button>
                        )}
                        {status !== 'Completed' && (
                          <button
                            className="btn-small btn-success"
                            onClick={() => updateProgress(module.id, 'Completed')}
                          >
                            Mark Done
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="all-users">
          <h2>Team Progress Overview</h2>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Completed</th>
                <th>In Progress</th>
                <th>Not Started</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map(userStats => (
                <tr key={userStats.user_id}>
                  <td>{userStats.email}</td>
                  <td>{userStats.completed}</td>
                  <td>{userStats.in_progress}</td>
                  <td>{userStats.not_started}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
