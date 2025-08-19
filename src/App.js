// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'; // Import the updated CSS file for styling

const App = () => {
    // State to store the GitHub username entered by the user
    const [username, setUsername] = useState('');
    // State to store the fetched GitHub profile data
    const [profile, setProfile] = useState(null);
    // State to store the fetched GitHub repositories
    const [repos, setRepos] = useState([]);
    // State to manage loading status during API calls
    const [loading, setLoading] = useState(false);
    // State to store any error messages
    const [error, setError] = useState(null);

    // --- New State for Filtering ---
    // State to store the term used to filter repositories by name
    const [filterTerm, setFilterTerm] = useState('');

    // --- New State for Pagination ---
    // Current page number for repositories (starts at 1)
    const [currentPage, setCurrentPage] = useState(1);
    // Number of repositories per page (GitHub API default is often 30)
    const [perPage] = useState(30);
    // Boolean to know if there are more pages to load (for disabling 'Next' button)
    const [hasMoreRepos, setHasMoreRepos] = useState(false);

    // useEffect hook to fetch repositories whenever currentPage or username changes
    useEffect(() => {
        // Only fetch if a username is provided and not already loading
        if (username.trim() && !loading) {
            fetchRepos();
        } else if (!username.trim()) {
            // Clear repos if username is cleared
            setRepos([]);
            setProfile(null);
            setError(null);
            setHasMoreRepos(false);
        }
    }, [currentPage, username]); // Dependencies: re-run when currentPage or username changes

    // Function to fetch GitHub user profile data
    const fetchProfile = async () => {
        setLoading(true); // Set loading to true while fetching
        setError(null);   // Clear any previous errors
        setProfile(null); // Clear previous profile data
        setRepos([]);     // Clear previous repo data
        setCurrentPage(1); // Reset page when fetching new profile

        if (!username.trim()) { // Trim to handle empty spaces as input
            setError('Please enter a GitHub username.');
            setLoading(false);
            return;
        }

        try {
            // Fetch user profile data from GitHub API
            const profileResponse = await axios.get(`https://api.github.com/users/${username.trim()}`);
            setProfile(profileResponse.data); // Update profile state
            // After fetching profile, automatically fetch repos for the first page
            fetchRepos(); // Call fetchRepos immediately after profile
        } catch (err) {
            console.error('Error fetching profile:', err);
            // Handle different types of errors (e.g., user not found)
            if (err.response && err.response.status === 404) {
                setError(`GitHub user "${username.trim()}" not found.`);
            } else {
                setError('Failed to fetch profile data. Please try again later.');
            }
            setProfile(null); // Ensure profile is null on error
            setRepos([]);     // Ensure repos are cleared on error
        } finally {
            setLoading(false); // Set loading to false once fetching is complete
        }
    };

    // Function to fetch GitHub user repositories with pagination
    const fetchRepos = async () => {
        setLoading(true); // Set loading to true while fetching
        setError(null);   // Clear any previous errors

        if (!username.trim()) {
            setError('Please enter a GitHub username.');
            setLoading(false);
            return;
        }

        try {
            // Fetch repositories data from GitHub API with pagination parameters
            const reposResponse = await axios.get(
                `https://api.github.com/users/${username.trim()}/repos?page=${currentPage}&per_page=${perPage}&sort=stars&direction=desc`
            );
            // GitHub API doesn't directly return total pages in a simple header,
            // but we can infer if there are more pages by checking if the number of
            // returned repos is exactly 'perPage'. If it is, there might be more.
            setHasMoreRepos(reposResponse.data.length === perPage);
            setRepos(reposResponse.data); // Update repos state
        } catch (err) {
            console.error('Error fetching repositories:', err);
            if (err.response && err.response.status === 404) {
                // This might happen if user has no public repos, or is not found (though profile check handles that)
                setError(`Could not retrieve public repositories for "${username.trim()}".`);
            } else {
                setError('Failed to fetch repositories. Please try again later.');
            }
            setRepos([]); // Ensure repos is empty on error
            setHasMoreRepos(false);
        } finally {
            setLoading(false); // Set loading to false once fetching is complete
        }
    };

    // --- Filtering Logic ---
    // Filter the 'repos' state based on the 'filterTerm'
    const filteredRepos = repos.filter(repo =>
        repo.name.toLowerCase().includes(filterTerm.toLowerCase())
    );

    // --- Pagination Handlers ---
    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => Math.max(1, prevPage - 1)); // Ensure page doesn't go below 1
    };

    // --- Render Logic ---
    return (
        <div className="container">
            <h1 className="title">GitHub Repo Tracker 🐙</h1>

            {/* Input and Buttons Section */}
            <div className="input-section">
                <input
                    type="text"
                    placeholder="Enter GitHub username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="username-input"
                    onKeyPress={(e) => { // Allow pressing Enter to fetch profile
                        if (e.key === 'Enter') {
                            fetchProfile();
                        }
                    }}
                />
                <div className="button-group">
                    <button onClick={fetchProfile} disabled={loading || !username.trim()} className="action-button">
                        {loading && profile === null ? 'Fetching Profile...' : 'Get Profile & Repos'}
                    </button>
                    {/* Re-fetch repos button is useful if filter/page is changed manually without username change */}
                    <button onClick={fetchRepos} disabled={loading || !username.trim()} className="action-button">
                        {loading && repos.length === 0 ? 'Fetching Repos...' : 'Refresh Repos'}
                    </button>
                </div>
            </div>

            {/* Loading and Error Messages */}
            {loading && (
                <div className="message loading">
                    Loading data...
                </div>
            )}
            {error && <p className="message error">{error}</p>}

            {/* Conditional rendering for Profile and Repositories */}
            {/* Show skeleton while loading, then actual content */}
            {loading && !profile && !error ? (
                // Show a full layout skeleton while first data is loading
                <div className="full-skeleton-layout">
                    <div className="profile-skeleton-section">
                        <div className="skeleton-avatar"></div>
                        <div className="skeleton-line large"></div>
                        <div className="skeleton-line medium"></div>
                        <div className="skeleton-line small"></div>
                    </div>
                    <div className="repos-skeleton-section">
                        <div className="skeleton-line large"></div>
                        <div className="skeleton-repo-item"></div>
                        <div className="skeleton-repo-item"></div>
                        <div className="skeleton-repo-item"></div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Profile Display Section */}
                    {profile && (
                        <div className="profile-section">
                            <h2>Profile: {profile.login}</h2>
                            <div className="profile-details">
                                {profile.avatar_url && (
                                    <img src={profile.avatar_url} alt={`${profile.login}'s avatar`} className="avatar" />
                                )}
                                <p><strong>Name:</strong> {profile.name || 'N/A'}</p>
                                <p><strong>Bio:</strong> {profile.bio || 'N/A'}</p>
                                <p><strong>Followers:</strong> {profile.followers}</p>
                                <p><strong>Following:</strong> {profile.following}</p>
                                <p><strong>Public Repos:</strong> {profile.public_repos}</p>
                                <p><strong>Location:</strong> {profile.location || 'N/A'}</p>
                                {profile.html_url && (
                                    <p><a href={profile.html_url} target="_blank" rel="noopener noreferrer" className="github-link">View on GitHub</a></p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Repositories Display Section */}
                    {profile && ( // Only show repos section if a profile has been loaded
                        <div className="repos-section">
                            <h2>Repositories ({profile ? profile.public_repos : 0})</h2> {/* Show actual public repo count */}
                            {/* Filter Input */}
                            <input
                                type="text"
                                placeholder="Filter repositories by name..."
                                value={filterTerm}
                                onChange={(e) => setFilterTerm(e.target.value)}
                                className="filter-input"
                            />

                            {/* Pagination Controls */}
                            <div className="pagination-controls">
                                <button onClick={handlePreviousPage} disabled={currentPage === 1 || loading} className="pagination-button">
                                    Previous
                                </button>
                                <span>Page {currentPage}</span>
                                <button onClick={handleNextPage} disabled={!hasMoreRepos || loading} className="pagination-button">
                                    Next
                                </button>
                            </div>

                            {/* Conditional Rendering for Repos List or No Repos Found */}
                            {filteredRepos.length === 0 && !loading ? (
                                <p className="no-repos-message">
                                    {filterTerm ? `No repositories found matching "${filterTerm}".` : 'No public repositories found for this user.'}
                                </p>
                            ) : (
                                <ul className="repo-list">
                                    {filteredRepos.map((repo) => (
                                        <li key={repo.id} className="repo-item">
                                            <h3>
                                                <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-link">
                                                    {repo.name}
                                                </a>
                                            </h3>
                                            <p>{repo.description || 'No description provided.'}</p>
                                            <div className="repo-meta">
                                                <span>⭐ {repo.stargazers_count}</span>
                                                <span>🍴 {repo.forks_count}</span>
                                                <span>🗓️ Last Updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
                                            </div>
                                            {repo.language && <span className="language-tag">{repo.language}</span>}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default App;