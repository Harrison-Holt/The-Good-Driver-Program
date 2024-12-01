import { useEffect, useState } from 'react';
import { useAppSelector } from "../../store/hooks";
import axios from 'axios';

interface LoginEvent {
    username: string;
    userPoolId: string;
    timestamp: string;
}

const Reports = () => {
    const [logins, setLogins] = useState<LoginEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get the current user's type (for admin access control)
    const userType = useAppSelector((state) => state.currentUser.userType);

    useEffect(() => {
        const fetchLogins = async () => {
            try {
                const response = await axios.get('https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/reports', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token for authentication
                    },
                });
                setLogins(response.data);
            } catch (err) {
                setError('Failed to fetch login events.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (userType === 'admin') {
            fetchLogins();
        } else {
            setError('Access denied: Only admins can view this page.');
            setLoading(false);
        }
    }, [userType]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Login Reports</h1>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>User Pool ID</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {logins.map((login, index) => (
                        <tr key={index}>
                            <td>{login.username}</td>
                            <td>{login.userPoolId}</td>
                            <td>{new Date(login.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Reports;
