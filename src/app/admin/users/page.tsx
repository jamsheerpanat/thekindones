
"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

type User = {
    id: string;
    name: string | null;
    email: string | null;
    role: "ADMIN" | "USER";
    createdAt: string;
    _count: {
        orders: number;
    }
};

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/tko/api/admin/users")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setUsers(data);
                setLoading(false);
            });
    }, []);

    const handleRoleChange = async (userId: string, newRole: "ADMIN" | "USER") => {
        if (!window.confirm(`Are you sure you want to make this user ${newRole}?`)) return;

        try {
            const res = await fetch(`/tko/api/admin/users`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, role: newRole })
            });

            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            } else {
                alert("Failed to update role. You cannot modify your own role.");
            }
        } catch (error) {
            console.error("Failed to update user:", error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="card p-6">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-ink-600">
                    <thead className="bg-ink-50 text-xs uppercase text-ink-400">
                        <tr>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Joined</th>
                            <th className="px-4 py-3 text-center">Orders</th>
                            <th className="px-4 py-3 text-center">Role</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-ink-50/50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="font-semibold text-ink-900">{user.name || "N/A"}</div>
                                    <div className="text-xs text-ink-400">{user.email}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                </td>
                                <td className="px-4 py-3 text-center font-medium">
                                    {user._count.orders}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {user.role === "USER" ? (
                                        <button
                                            onClick={() => handleRoleChange(user.id, "ADMIN")}
                                            className="text-xs font-semibold text-brand-600 hover:underline"
                                        >
                                            Promote to Admin
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleRoleChange(user.id, "USER")}
                                            className="text-xs font-semibold text-red-600 hover:underline"
                                        >
                                            Demote to User
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
